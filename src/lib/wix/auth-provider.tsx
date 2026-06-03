"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

import type { OauthData, StateMachine } from "@wix/sdk";

import {
	type AuthFlowResult,
	fetchCurrentMember,
	loginWithEmail,
	memberAvatar,
	memberDisplayName,
	memberEmail,
	registerWithEmail,
	verifyEmailCode,
	type WixMember,
} from "./auth-actions";
import type { WixBrowserClient } from "./browser-client";
import { AUTH_CALLBACK_PATH, WIX_OAUTH_DATA_KEY } from "./constants";
import { clearSessionCookie, setTokensCookie } from "./session";

export type WixAuthContextValue = {
	client: WixBrowserClient | null;
	isReady: boolean;
	isLoggedIn: boolean;
	isPending: boolean;
	error: string | null;
	member: WixMember | null;
	needsVerification: boolean;
	clearError: () => void;
	loginWithEmail: (email: string, password: string) => Promise<AuthFlowResult>;
	registerWithEmail: (
		email: string,
		password: string,
		fullName: string
	) => Promise<AuthFlowResult>;
	verifyEmail: (code: string) => Promise<AuthFlowResult>;
	startWixLogin: (returnUrl?: string) => Promise<void>;
	sendPasswordReset: (email: string) => Promise<void>;
	logout: () => Promise<void>;
	refreshMember: () => Promise<void>;
	memberDisplayName: string;
	memberEmail: string;
	memberAvatar: string;
};

const WixAuthContext = createContext<WixAuthContextValue | null>(null);

export function AuthProvider({
	client,
	isReady,
	children,
}: {
	client: WixBrowserClient | null;
	isReady: boolean;
	children: ReactNode;
}) {
	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [member, setMember] = useState<WixMember | null>(null);
	const [needsVerification, setNeedsVerification] = useState(false);
	const pendingAuthState = useRef<StateMachine | undefined>(undefined);

	const isLoggedIn = Boolean(client?.auth.loggedIn());

	const refreshMember = useCallback(async () => {
		if (!client) return;
		const current = await fetchCurrentMember(client);
		setMember(current);
	}, [client]);

	useEffect(() => {
		if (client?.auth.loggedIn()) {
			fetchCurrentMember(client).then(setMember);
		} else {
			setMember(null);
		}
	}, [client]);

	const clearError = useCallback(() => setError(null), []);

	const handleAuthResult = useCallback(
		async (result: AuthFlowResult) => {
			if (result.status === "success") {
				setNeedsVerification(false);
				pendingAuthState.current = undefined;
				if (client) {
					const tokens = client.auth.getTokens();
					setTokensCookie(tokens);
					await refreshMember();
				}
				return result;
			}

			if (result.status === "verification") {
				setNeedsVerification(true);
				pendingAuthState.current = result.state;
				return result;
			}

			if (result.status === "owner_approval") {
				setError(
					"Your account is pending approval. You can log in once the site owner approves your registration."
				);
				return result;
			}

			setError(result.message);
			return result;
		},
		[client, refreshMember]
	);

	const loginWithEmailHandler = useCallback(
		async (email: string, password: string) => {
			if (!client) {
				return {
					status: "error" as const,
					message: "Wix client is not configured.",
				};
			}
			setIsPending(true);
			setError(null);
			try {
				const result = await loginWithEmail(client, email, password);
				return handleAuthResult(result);
			} finally {
				setIsPending(false);
			}
		},
		[client, handleAuthResult]
	);

	const registerWithEmailHandler = useCallback(
		async (email: string, password: string, fullName: string) => {
			if (!client) {
				return {
					status: "error" as const,
					message: "Wix client is not configured.",
				};
			}
			setIsPending(true);
			setError(null);
			try {
				const parts = fullName.trim().split(/\s+/).filter(Boolean);
				const firstName = parts[0] ?? "";
				const lastName =
					parts.length > 1 ? parts.slice(1).join(" ") : undefined;

				const result = await registerWithEmail(client, email, password, {
					firstName,
					lastName,
				});
				return handleAuthResult(result);
			} finally {
				setIsPending(false);
			}
		},
		[client, handleAuthResult]
	);

	const verifyEmailHandler = useCallback(
		async (code: string) => {
			if (!client) {
				return {
					status: "error" as const,
					message: "Wix client is not configured.",
				};
			}
			setIsPending(true);
			setError(null);
			try {
				const result = await verifyEmailCode(
					client,
					code,
					pendingAuthState.current
				);
				return handleAuthResult(result);
			} finally {
				setIsPending(false);
			}
		},
		[client, handleAuthResult]
	);

	const startWixLogin = useCallback(
		async (returnUrl?: string) => {
			if (!client) {
				setError("Wix client is not configured.");
				return;
			}
			setIsPending(true);
			setError(null);
			try {
				const returnPath =
					returnUrl && returnUrl.startsWith(window.location.origin)
						? returnUrl.slice(window.location.origin.length) || "/"
						: returnUrl;

				const res = await fetch("/api/wix/login", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						returnUrl: returnPath?.startsWith("/") ? returnPath : undefined,
					}),
				});

				if (res.ok) {
					const { authUrl } = (await res.json()) as { authUrl?: string };
					if (authUrl) {
						window.location.href = authUrl;
						return;
					}
				}

				const redirectUri = `${window.location.origin}${AUTH_CALLBACK_PATH}`;
				const oauthData: OauthData = client.auth.generateOAuthData(
					redirectUri,
					returnUrl ?? window.location.href
				);
				sessionStorage.setItem(WIX_OAUTH_DATA_KEY, JSON.stringify(oauthData));
				const { authUrl } = await client.auth.getAuthUrl(oauthData);
				window.location.href = authUrl;
			} catch (e) {
				setError(
					e instanceof Error ? e.message : "Could not start social login."
				);
				setIsPending(false);
			}
		},
		[client]
	);

	const sendPasswordReset = useCallback(
		async (email: string) => {
			if (!client) {
				setError("Wix client is not configured.");
				return;
			}
			setIsPending(true);
			setError(null);
			try {
				await client.auth.sendPasswordResetEmail(
					email,
					`${window.location.origin}/login`
				);
			} catch (e) {
				setError(
					e instanceof Error
						? e.message
						: "Could not send password reset email."
				);
			} finally {
				setIsPending(false);
			}
		},
		[client]
	);

	const logout = useCallback(async () => {
		if (!client) return;
		setIsPending(true);
		try {
			const { logoutUrl } = await client.auth.logout(window.location.href);
			clearSessionCookie();
			setMember(null);
			setNeedsVerification(false);
			pendingAuthState.current = undefined;
			window.location.href = logoutUrl;
		} catch (e) {
			clearSessionCookie();
			setMember(null);
			window.location.href = "/";
			setError(e instanceof Error ? e.message : "Logout failed.");
			setIsPending(false);
		}
	}, [client]);

	const authValue = useMemo<WixAuthContextValue>(
		() => ({
			client,
			isReady,
			isLoggedIn,
			isPending,
			error,
			member,
			needsVerification,
			clearError,
			loginWithEmail: loginWithEmailHandler,
			registerWithEmail: registerWithEmailHandler,
			verifyEmail: verifyEmailHandler,
			startWixLogin,
			sendPasswordReset,
			logout,
			refreshMember,
			memberDisplayName: memberDisplayName(member),
			memberEmail: memberEmail(member),
			memberAvatar: memberAvatar(member),
		}),
		[
			client,
			isReady,
			isLoggedIn,
			isPending,
			error,
			member,
			needsVerification,
			clearError,
			loginWithEmailHandler,
			registerWithEmailHandler,
			verifyEmailHandler,
			startWixLogin,
			sendPasswordReset,
			logout,
			refreshMember,
		]
	);

	return (
		<WixAuthContext.Provider value={authValue}>
			{children}
		</WixAuthContext.Provider>
	);
}

export function useWixAuth() {
	const ctx = useContext(WixAuthContext);
	if (!ctx) {
		throw new Error("useWixAuth must be used within AuthProvider");
	}
	return ctx;
}
