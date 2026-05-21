"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import type { OauthData } from "@wix/sdk";

import { createBrowserClient } from "@/lib/wix/browser-client";
import { WIX_OAUTH_DATA_KEY } from "@/lib/wix/constants";
import { getTokensFromCookie, setTokensCookie } from "@/lib/wix/session";

export default function AuthCallbackPage() {
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [redirectTo, setRedirectTo] = useState("/profile");

	useEffect(() => {
		async function verifyLogin() {
			const client = createBrowserClient(getTokensFromCookie());
			if (!client) {
				setErrorMessage(
					"Wix is not configured. Set NEXT_PUBLIC_WIX_CLIENT_ID in .env.local."
				);
				return;
			}

			const rawOauth = sessionStorage.getItem(WIX_OAUTH_DATA_KEY);
			sessionStorage.removeItem(WIX_OAUTH_DATA_KEY);

			if (!rawOauth) {
				setErrorMessage(
					"Missing OAuth session data. Please try logging in again."
				);
				setRedirectTo("/login");
				return;
			}

			let oauthData: OauthData;
			try {
				oauthData = JSON.parse(rawOauth) as OauthData;
			} catch {
				setErrorMessage(
					"Invalid OAuth session data. Please try logging in again."
				);
				setRedirectTo("/login");
				return;
			}

			setRedirectTo(oauthData.originalUri || "/profile");

			const parsed = client.auth.parseFromUrl();
			if (parsed.error) {
				setErrorMessage(
					parsed.errorDescription ??
						parsed.error ??
						"Authentication was cancelled."
				);
				return;
			}

			try {
				const tokens = await client.auth.getMemberTokens(
					parsed.code,
					parsed.state,
					oauthData
				);
				client.auth.setTokens(tokens);
				setTokensCookie(tokens);
				router.replace(oauthData.originalUri || "/profile");
			} catch (e) {
				setErrorMessage(
					e instanceof Error ? e.message : "Could not complete sign-in."
				);
			}
		}

		verifyLogin();
	}, [router]);

	return (
		<main className="flex min-h-svh items-center justify-center px-4">
			<div className="w-full max-w-md rounded-md border border-stone-100 bg-white p-8 text-center">
				{errorMessage ? (
					<>
						<p className="mb-6 text-red-600 text-sm">{errorMessage}</p>
						<Link
							className="font-bold text-primary text-sm hover:underline"
							href={redirectTo.startsWith("/login") ? redirectTo : "/login"}
						>
							Back to login
						</Link>
					</>
				) : (
					<p className="font-bold text-secondary text-sm">
						Completing sign-in…
					</p>
				)}
			</div>
		</main>
	);
}
