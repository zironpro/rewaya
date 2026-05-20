"use client";

import { createContext, type ReactNode, useContext, useMemo } from "react";

import { currentCart } from "@wix/ecom";
import { redirects } from "@wix/redirects";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { catalogVersioning, products, productsV3 } from "@wix/stores";

import { WIX_SITE_ID } from "./constants";

type WixBrowserClient = ReturnType<typeof createBrowserClient>;

function createBrowserClient() {
	const clientId = process.env.NEXT_PUBLIC_WIX_CLIENT_ID;
	if (!clientId) {
		return null;
	}

	return createClient({
		modules: {
			products,
			productsV3,
			catalogVersioning,
			currentCart,
			redirects,
		},
		auth: OAuthStrategy({ clientId }),
		headers: { "wix-site-id": WIX_SITE_ID },
	});
}

const WixContext = createContext<WixBrowserClient>(null);

export function WixProvider({ children }: { children: ReactNode }) {
	const client = useMemo(() => createBrowserClient(), []);

	return <WixContext.Provider value={client}>{children}</WixContext.Provider>;
}

export function useWixClient() {
	return useContext(WixContext);
}
