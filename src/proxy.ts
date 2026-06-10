import { type NextRequest, NextResponse } from "next/server";

import { createClient, OAuthStrategy } from "@wix/sdk";

import { WIX_SITE_ID } from "@/lib/wix/constants";
import {
	getWixOAuthClientId,
	hasUsableSessionTokens,
	parseSessionTokens,
	SESSION_MAX_AGE,
	serializeSessionTokens,
	WIX_SESSION_COOKIE,
} from "@/lib/wix/session-cookie";

export async function proxy(request: NextRequest) {
	const pathname = request.nextUrl?.pathname ?? request.url;
	const wixRedirectHost = "https://store.rewayabooks.com";
	const wixManagedPrefixes = ["/_api", "/__ecom", "/checkout"];

	for (const p of wixManagedPrefixes) {
		if (pathname === p || pathname.startsWith(`${p}/`)) {
			// Build destination URL on the wix redirect host and rewrite
			// any redirectUrl param that points at the public site to the store host.
			const dest = new URL(request.nextUrl.pathname, wixRedirectHost);
			for (const [key, value] of request.nextUrl.searchParams) {
				let newVal = value;
				if (key === "redirectUrl") {
					try {
						const ru = new URL(value);
						if (ru.hostname === "www.rewayabooks.com") {
							ru.hostname = "store.rewayabooks.com";
							newVal = ru.toString();
						}
					} catch {
						newVal = value.replace(
							"https://www.rewayabooks.com",
							"https://store.rewayabooks.com"
						);
					}
				}
				dest.searchParams.set(key, newVal);
			}
			return NextResponse.redirect(dest);
		}
	}

	const existing = parseSessionTokens(
		request.cookies.get(WIX_SESSION_COOKIE)?.value
	);
	if (hasUsableSessionTokens(existing)) {
		return NextResponse.next();
	}

	const clientId = getWixOAuthClientId();
	if (!clientId) {
		return NextResponse.next();
	}

	const wixClient = createClient({
		auth: OAuthStrategy({ clientId }),
		headers: { "wix-site-id": WIX_SITE_ID },
	});

	try {
		const visitorTokens = await wixClient.auth.generateVisitorTokens(existing);
		const response = NextResponse.next();

		response.cookies.set(
			WIX_SESSION_COOKIE,
			serializeSessionTokens(visitorTokens),
			{
				path: "/",
				maxAge: SESSION_MAX_AGE,
				sameSite: "lax",
			}
		);
		return response;
	} catch {
		return NextResponse.next();
	}
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
	],
};
