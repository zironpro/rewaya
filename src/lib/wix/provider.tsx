"use client";

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

import { AuthProvider } from "./auth-provider";
import { createBrowserClient, type WixBrowserClient } from "./browser-client";
import { getTokensFromCookie } from "./session";

const WixContext = createContext<WixBrowserClient | null>(null);

export function WixProvider({ children }: { children: ReactNode }) {
	const [client, setClient] = useState<WixBrowserClient | null>(null);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		const tokens = getTokensFromCookie();
		const wixClient = createBrowserClient(tokens);
		setClient(wixClient);
		setIsReady(true);
	}, []);

	return (
		<WixContext.Provider value={client}>
			<AuthProvider client={client} isReady={isReady}>
				{children}
			</AuthProvider>
		</WixContext.Provider>
	);
}

export function useWixClient() {
	return useContext(WixContext);
}

export { useWixAuth } from "./auth-provider";
