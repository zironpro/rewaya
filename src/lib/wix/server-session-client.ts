"use server";

import { cookies } from "next/headers";

import { items } from "@wix/data";
import { currentCart } from "@wix/ecom";
import { redirects } from "@wix/redirects";
import { createClient, OAuthStrategy, type Tokens } from "@wix/sdk";
import {
	catalogVersioning,
	collections,
	products,
	productsV3,
} from "@wix/stores";

import { WIX_SITE_ID } from "./constants";
import {
	getWixOAuthClientId,
	hasUsableSessionTokens,
	parseSessionTokens,
	SESSION_MAX_AGE,
	serializeSessionTokens,
	WIX_SESSION_COOKIE,
} from "./session-cookie";

function isNoIdentityError(error: unknown): boolean {
	const code = (error as { details?: { applicationError?: { code?: string } } })
		?.details?.applicationError?.code;
	return code === "NO_IDENTITY_IN_CONTEXT";
}

function createSessionClient(clientId: string, tokens?: Tokens) {
	return createClient({
		modules: {
			products,
			productsV3,
			collections,
			catalogVersioning,
			currentCart,
			redirects,
			items,
		},
		auth: OAuthStrategy({
			clientId,
			...(tokens ? { tokens } : {}),
		}),
		headers: { "wix-site-id": WIX_SITE_ID },
	});
}

async function persistSessionTokens(tokens: Tokens) {
	const cookieStore = await cookies();
	cookieStore.set(WIX_SESSION_COOKIE, serializeSessionTokens(tokens), {
		path: "/",
		maxAge: SESSION_MAX_AGE,
		sameSite: "lax",
	});
}

async function resolveSessionTokens(
	clientId: string,
	parsed?: Tokens
): Promise<Tokens> {
	const client = createSessionClient(clientId, parsed);
	const tokens = await client.auth.generateVisitorTokens(parsed);
	client.auth.setTokens(tokens);
	return tokens;
}

/**
 * Per-request Wix client for cart/ecom (not cached).
 * Uses visitor/member OAuth tokens from the `wix_session` cookie — same session as
 * the browser after `proxy.ts` mints or refreshes visitor tokens.
 */
export async function getWixServerSessionClient() {
	const clientId = getWixOAuthClientId();
	if (!clientId) {
		throw new Error(
			"Missing WIX_CLIENT_ID / NEXT_PUBLIC_WIX_CLIENT_ID. Run `npx @wix/cli login` then `npx @wix/cli env pull`."
		);
	}

	const cookieStore = await cookies();
	const parsed = parseSessionTokens(cookieStore.get(WIX_SESSION_COOKIE)?.value);

	let tokens = parsed;
	if (!tokens || !hasUsableSessionTokens(tokens)) {
		tokens = await resolveSessionTokens(clientId, parsed);
		await persistSessionTokens(tokens);
	}

	const client = createSessionClient(clientId, tokens);
	client.auth.setTokens(tokens);
	return client;
}

/** Run a cart/ecom call; on invalid identity, mint fresh visitor tokens and retry once. */
export async function withWixServerSessionClient<T>(
	fn: (
		client: Awaited<ReturnType<typeof getWixServerSessionClient>>
	) => Promise<T>
): Promise<T> {
	try {
		return await fn(await getWixServerSessionClient());
	} catch (error) {
		if (!isNoIdentityError(error)) throw error;

		const clientId = getWixOAuthClientId();
		if (!clientId) throw error;

		const cookieStore = await cookies();
		cookieStore.delete(WIX_SESSION_COOKIE);

		const tokens = await resolveSessionTokens(clientId);
		await persistSessionTokens(tokens);

		const client = createSessionClient(clientId, tokens);
		client.auth.setTokens(tokens);
		return await fn(client);
	}
}
