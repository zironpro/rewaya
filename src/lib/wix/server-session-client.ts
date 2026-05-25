import "server-only";

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

import { WIX_SESSION_COOKIE, WIX_SITE_ID } from "./constants";

function parseTokens(raw: string | undefined): Tokens | undefined {
	if (!raw) return undefined;
	try {
		return JSON.parse(decodeURIComponent(raw)) as Tokens;
	} catch {
		try {
			return JSON.parse(raw) as Tokens;
		} catch {
			return undefined;
		}
	}
}

/** Wix client for server actions using visitor/member tokens from wix_session cookie. */
export async function getWixServerSessionClient() {
	const clientId = process.env.WIX_CLIENT_ID;
	if (!clientId) {
		throw new Error(
			"Missing WIX_CLIENT_ID. Run `npx @wix/cli login` then `npx @wix/cli env pull`."
		);
	}

	const cookieStore = await cookies();
	const tokens = parseTokens(cookieStore.get(WIX_SESSION_COOKIE)?.value);

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
