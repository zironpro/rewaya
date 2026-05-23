import { items } from "@wix/data";
import { currentCart, orders } from "@wix/ecom";
import { memberPrivacySettings, members } from "@wix/members";
import { redirects } from "@wix/redirects";
import { createClient, OAuthStrategy, type Tokens } from "@wix/sdk";
import { catalogVersioning, products, productsV3 } from "@wix/stores";

import { WIX_SITE_ID } from "./constants";

export type WixBrowserClient = ReturnType<typeof createBrowserClient>;

export function createBrowserClient(initialTokens?: Tokens | null) {
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
			orders,
			redirects,
			members,
			memberPrivacySettings,
			items,
		},
		auth: OAuthStrategy({
			clientId,
			...(initialTokens ? { tokens: initialTokens } : {}),
		}),
		headers: { "wix-site-id": WIX_SITE_ID },
	});
}
