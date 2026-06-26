import { items } from "@wix/data";
import { orders } from "@wix/ecom";
import { memberPrivacySettings, members } from "@wix/members";
import { createClient, OAuthStrategy, type Tokens } from "@wix/sdk";
import { catalogVersioning, products, productsV3 } from "@wix/stores";

export type WixBrowserClient = ReturnType<typeof createBrowserClient>;

/**
 * Browser Wix client for auth, members, wishlist, and catalog reads.
 * Cart/checkout use server actions — edge APIs block `wix-site-id` from the browser (CORS).
 */
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
			orders,
			members,
			memberPrivacySettings,
			items,
		},
		auth: OAuthStrategy({
			clientId,
			...(initialTokens ? { tokens: initialTokens } : {}),
		}),
	});
}
