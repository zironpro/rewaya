import { type NextRequest, NextResponse } from "next/server";

import { createClient, OAuthStrategy } from "@wix/sdk";

import { WIX_SESSION_COOKIE, WIX_SITE_ID } from "@/lib/wix/constants";

const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

export async function proxy(request: NextRequest) {
	if (request.cookies.get(WIX_SESSION_COOKIE)?.value) {
		return NextResponse.next();
	}

	const clientId = process.env.NEXT_PUBLIC_WIX_CLIENT_ID;
	if (!clientId) {
		return NextResponse.next();
	}

	const wixClient = createClient({
		auth: OAuthStrategy({ clientId }),
		headers: { "wix-site-id": WIX_SITE_ID },
	});

	try {
		const visitorTokens = await wixClient.auth.generateVisitorTokens();
		const response = NextResponse.next();
		response.cookies.set(WIX_SESSION_COOKIE, JSON.stringify(visitorTokens), {
			path: "/",
			maxAge: SESSION_MAX_AGE,
			sameSite: "lax",
		});
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
