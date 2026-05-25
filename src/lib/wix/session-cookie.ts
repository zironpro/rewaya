import type { Tokens } from "@wix/sdk";

import { WIX_SESSION_COOKIE } from "./constants";

export { WIX_SESSION_COOKIE };

export const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

/** OAuth client ID — same value must be used in proxy and server session client. */
export function getWixOAuthClientId(): string | undefined {
	return process.env.WIX_CLIENT_ID ?? process.env.NEXT_PUBLIC_WIX_CLIENT_ID;
}

export function parseSessionTokens(
	raw: string | undefined
): Tokens | undefined {
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

export function hasUsableSessionTokens(tokens: Tokens | undefined): boolean {
	if (!tokens?.accessToken?.value || !tokens?.refreshToken?.value) {
		return false;
	}
	const now = Math.floor(Date.now() / 1000);
	return tokens.accessToken.expiresAt > now;
}

export function serializeSessionTokens(tokens: Tokens): string {
	return JSON.stringify(tokens);
}
