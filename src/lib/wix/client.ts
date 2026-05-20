import { createClient, OAuthStrategy, type IOAuthStrategy } from "@wix/sdk";
import { items } from "@wix/data";
import { currentCart } from "@wix/ecom";
import {
	catalogVersioning,
	products,
	productsV3,
	type CatalogVersion,
} from "@wix/stores";

import { WIX_SITE_ID } from "./constants";

let cachedClient: ReturnType<typeof createWixClient> | null = null;
let cachedCatalogVersion: CatalogVersion | null = null;

function createWixClient() {
	const clientId = process.env.WIX_CLIENT_ID;
	if (!clientId) {
		throw new Error(
			"Missing WIX_CLIENT_ID. Run `npx @wix/cli login` then `npx @wix/cli env pull`."
		);
	}

	return createClient({
		modules: {
			products,
			productsV3,
			catalogVersioning,
			currentCart,
			items,
		},
		auth: OAuthStrategy({
			clientId,
		}) as IOAuthStrategy,
		headers: {
			"wix-site-id": WIX_SITE_ID,
		},
	});
}

export function getWixClient() {
	if (!cachedClient) {
		cachedClient = createWixClient();
	}
	return cachedClient;
}

export async function getCatalogVersion(): Promise<CatalogVersion> {
	if (cachedCatalogVersion) return cachedCatalogVersion;

	const client = getWixClient();
	const { catalogVersion } = await client.catalogVersioning.getCatalogVersion();
	cachedCatalogVersion = catalogVersion;
	return catalogVersion;
}
