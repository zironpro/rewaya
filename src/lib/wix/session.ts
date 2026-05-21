import type { Tokens } from "@wix/sdk";

import { WIX_SESSION_COOKIE } from "./constants";

const COOKIE_MAX_AGE_DAYS = 14;

function parseCookieValue(raw: string | undefined): Tokens | null {
	if (!raw) return null;
	try {
		return JSON.parse(decodeURIComponent(raw)) as Tokens;
	} catch {
		try {
			return JSON.parse(raw) as Tokens;
		} catch {
			return null;
		}
	}
}

/** Read Wix tokens from the browser session cookie. */
export function getTokensFromCookie(): Tokens | null {
	if (typeof document === "undefined") return null;

	const prefix = `${WIX_SESSION_COOKIE}=`;
	const match = document.cookie
		.split("; ")
		.find((row) => row.startsWith(prefix));
	if (!match) return null;

	return parseCookieValue(match.slice(prefix.length));
}

/** Persist Wix tokens in the session cookie (14 days). */
export function setTokensCookie(tokens: Tokens): void {
	if (typeof document === "undefined") return;

	const value = encodeURIComponent(JSON.stringify(tokens));
	const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
	document.cookie = `${WIX_SESSION_COOKIE}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/** Remove the session cookie (logout on client). */
export function clearSessionCookie(): void {
	if (typeof document === "undefined") return;
	document.cookie = `${WIX_SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
