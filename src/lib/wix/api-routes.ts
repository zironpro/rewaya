import "server-only";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createClient, OAuthStrategy, type OauthData } from "@wix/sdk";

import { getCheckoutUrl } from "@/features/cart/cart-actions";
import { resolveCheckoutOrigin } from "@/lib/wix/checkout-origin";
import {
	AUTH_CALLBACK_PATH,
	WIX_OAUTH_DATA_KEY,
	WIX_SITE_ID,
} from "@/lib/wix/constants";
import {
	getWixOAuthClientId,
	parseSessionTokens,
	SESSION_MAX_AGE,
	serializeSessionTokens,
	WIX_SESSION_COOKIE,
} from "@/lib/wix/session-cookie";

const WIX_OAUTH_COOKIE = "wix_oauth_data";
const OAUTH_COOKIE_MAX_AGE = 60 * 10;

/** Path prefixes allowed through the Wix API proxy (blocks open proxy abuse). */
const ALLOWED_PROXY_PREFIXES = [
	"oauth2/",
	"ecom/",
	"redirects/",
	"stores/",
	"stores-reader/",
	"members/",
	"identity/",
	"wix-data/",
	"site-properties/",
	"categories/",
	"_api/",
] as const;

const UPSTREAM_WWW = "www.wixapis.com";
const UPSTREAM_EDGE = "edge.wixapis.com";

function jsonError(message: string, status: number) {
	return NextResponse.json({ error: message }, { status });
}

function createRouteClient(tokens?: ReturnType<typeof parseSessionTokens>) {
	const clientId = getWixOAuthClientId();
	if (!clientId) {
		throw new Error(
			"Missing WIX_CLIENT_ID / NEXT_PUBLIC_WIX_CLIENT_ID. Run `npx @wix/cli env pull`."
		);
	}

	return createClient({
		auth: OAuthStrategy({
			clientId,
			...(tokens ? { tokens } : {}),
		}),
		headers: { "wix-site-id": WIX_SITE_ID },
	});
}

function upstreamHost(apiPath: string): string {
	return apiPath.startsWith("oauth2/") ? UPSTREAM_WWW : UPSTREAM_EDGE;
}

function isAllowedProxyPath(apiPath: string): boolean {
	if (!apiPath || apiPath.includes("..")) return false;
	return ALLOWED_PROXY_PREFIXES.some((prefix) => apiPath.startsWith(prefix));
}

function buildUpstreamUrl(apiPath: string, requestUrl: string): URL {
	const incoming = new URL(requestUrl);
	const host = upstreamHost(apiPath);
	const url = new URL(`https://${host}/${apiPath}`);
	url.search = incoming.search;
	return url;
}

function pickForwardRequestHeaders(request: Request): Headers {
	const out = new Headers();
	const allow = [
		"authorization",
		"content-type",
		"accept",
		"accept-language",
		"x-wix-consistency",
	] as const;

	for (const name of allow) {
		const value = request.headers.get(name);
		if (value) out.set(name, value);
	}

	out.set("wix-site-id", WIX_SITE_ID);
	return out;
}

function pickForwardResponseHeaders(upstream: Response): Headers {
	const out = new Headers();
	const allow = ["content-type", "cache-control", "x-wix-request-id"] as const;

	for (const name of allow) {
		const value = upstream.headers.get(name);
		if (value) out.set(name, value);
	}
	return out;
}

async function sessionTokensFromRequest() {
	const cookieStore = await cookies();
	return parseSessionTokens(cookieStore.get(WIX_SESSION_COOKIE)?.value);
}

/** POST /api/wix/login — start Wix-managed login (returns authUrl). */
export async function handleWixLogin(request: Request) {
	try {
		const client = createRouteClient(await sessionTokensFromRequest());
		const body = (await request.json().catch(() => ({}))) as {
			returnUrl?: string;
		};

		const origin = await resolveCheckoutOrigin();
		const redirectUri = `${origin}${AUTH_CALLBACK_PATH}`;
		const originalUri =
			typeof body.returnUrl === "string" && body.returnUrl.startsWith("/")
				? `${origin}${body.returnUrl}`
				: typeof body.returnUrl === "string"
					? body.returnUrl
					: origin;

		const oauthData = client.auth.generateOAuthData(redirectUri, originalUri);
		const { authUrl } = await client.auth.getAuthUrl(oauthData);

		const response = NextResponse.json({ authUrl });
		const cookieStore = await cookies();
		cookieStore.set(WIX_OAUTH_COOKIE, JSON.stringify(oauthData), {
			httpOnly: true,
			sameSite: "lax",
			path: "/",
			maxAge: OAUTH_COOKIE_MAX_AGE,
		});
		return response;
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Could not start login.";
		return jsonError(message, 500);
	}
}

/** POST /api/wix/logout — Wix-managed logout URL; clears session cookie. */
export async function handleWixLogout(_request: Request) {
	try {
		const tokens = await sessionTokensFromRequest();
		const client = createRouteClient(tokens);
		const postFlowUrl = await resolveCheckoutOrigin();
		const { logoutUrl } = await client.auth.logout(postFlowUrl);

		const response = NextResponse.json({ logoutUrl });
		const cookieStore = await cookies();
		cookieStore.delete(WIX_SESSION_COOKIE);
		cookieStore.delete(WIX_OAUTH_COOKIE);
		return response;
	} catch (error) {
		const cookieStore = await cookies();
		cookieStore.delete(WIX_SESSION_COOKIE);
		const message =
			error instanceof Error ? error.message : "Could not start logout.";
		return jsonError(message, 500);
	}
}

/** GET|POST /api/wix/checkout — create hosted checkout redirect URL. */
export async function handleWixCheckout(request: Request) {
	const originParam =
		new URL(request.url).searchParams.get("origin") ?? undefined;

	try {
		const result = await getCheckoutUrl(originParam ?? undefined);
		if (!result.ok || !result.checkoutUrl) {
			return NextResponse.json(
				{
					ok: false,
					error: result.error ?? "Checkout URL was not returned.",
					debug: result.debug,
				},
				{ status: 502 }
			);
		}

		if (request.method === "GET") {
			const redirect =
				new URL(request.url).searchParams.get("redirect") !== "false";
			if (redirect) {
				return NextResponse.redirect(result.checkoutUrl);
			}
		}

		return NextResponse.json({
			ok: true,
			checkoutUrl: result.checkoutUrl,
			debug: result.debug,
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Could not start checkout.";
		return NextResponse.json({ ok: false, error: message }, { status: 500 });
	}
}

/** Proxy /api/wix/<wix-api-path> to Wix (edge or www). */
export async function proxyWixApi(request: Request, pathSegments: string[]) {
	const apiPath = pathSegments.join("/");
	if (!isAllowedProxyPath(apiPath)) {
		return jsonError("Path not allowed.", 404);
	}

	const tokens = await sessionTokensFromRequest();
	const upstreamUrl = buildUpstreamUrl(apiPath, request.url);
	const headers = pickForwardRequestHeaders(request);

	if (!headers.has("authorization") && tokens?.accessToken?.value) {
		headers.set("authorization", tokens.accessToken.value);
	}

	const init: RequestInit = {
		method: request.method,
		headers,
	};

	if (request.method !== "GET" && request.method !== "HEAD") {
		const body = await request.arrayBuffer();
		if (body.byteLength > 0) {
			init.body = body;
		}
	}

	let upstream: Response;
	try {
		upstream = await fetch(upstreamUrl, init);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Upstream request failed.";
		return jsonError(message, 502);
	}

	return new NextResponse(upstream.body, {
		status: upstream.status,
		headers: pickForwardResponseHeaders(upstream),
	});
}

export async function handleWixApiRoute(
	request: Request,
	pathSegments: string[]
): Promise<NextResponse> {
	const [head, ...rest] = pathSegments;

	if (head === "login" && rest.length === 0 && request.method === "POST") {
		return handleWixLogin(request);
	}

	if (head === "logout" && rest.length === 0 && request.method === "POST") {
		return handleWixLogout(request);
	}

	if (
		head === "checkout" &&
		rest.length === 0 &&
		(request.method === "GET" || request.method === "POST")
	) {
		return handleWixCheckout(request);
	}

	if (
		head === "session" &&
		rest[0] === "refresh" &&
		request.method === "POST"
	) {
		try {
			const client = createRouteClient(await sessionTokensFromRequest());
			const tokens = await client.auth.generateVisitorTokens(
				await sessionTokensFromRequest()
			);
			const response = NextResponse.json({ ok: true });
			const cookieStore = await cookies();
			cookieStore.set(WIX_SESSION_COOKIE, serializeSessionTokens(tokens), {
				path: "/",
				maxAge: SESSION_MAX_AGE,
				sameSite: "lax",
			});
			return response;
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Could not refresh session.";
			return jsonError(message, 500);
		}
	}

	return proxyWixApi(request, pathSegments);
}

/** Read OAuth PKCE payload set by POST /api/wix/login (httpOnly cookie). */
export async function consumeOAuthDataCookie(): Promise<OauthData | null> {
	const cookieStore = await cookies();
	const raw = cookieStore.get(WIX_OAUTH_COOKIE)?.value;
	if (!raw) return null;
	cookieStore.delete(WIX_OAUTH_COOKIE);
	try {
		return JSON.parse(raw) as OauthData;
	} catch {
		return null;
	}
}

export { WIX_OAUTH_COOKIE, WIX_OAUTH_DATA_KEY };
