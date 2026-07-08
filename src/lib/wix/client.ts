"use server";

import { cookies } from "next/headers";

import { items } from "@wix/data";
import { currentCart } from "@wix/ecom";
import { createClient, OAuthStrategy } from "@wix/sdk";
import {
	catalogVersioning,
	collections,
	products,
	productsV3,
} from "@wix/stores";

import { WIX_SESSION_COOKIE, WIX_SITE_ID } from "./constants";
import { parseSessionTokens } from "./session-cookie";

/** Resolved catalog mode from Wix (e.g. `V3_CATALOG`). */
export type CatalogVersion = string;

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
			collections,
			catalogVersioning,
			items,
		},
		auth: OAuthStrategy({
			clientId,
		}),
		headers: {
			"wix-site-id": WIX_SITE_ID,
		},
		fetch: (url, request) =>
			fetch(url, {
				...request,
				cache: "force-cache",
				next: {
					revalidate: 60,
					tags: ["wix", "products"],
				},
			}),
	});
}

/**
 * App-level Wix client for catalog/CMS reads (OAuth + site id).
 * Do not use for `currentCart` — use `getWixServerSessionClient` from
 * `./server-session-client` (visitor/member tokens from `wix_session` cookie).
 */
export async function getWixClient() {
	if (!cachedClient) {
		cachedClient = createWixClient();
	}
	return cachedClient;
}

export async function getCatalogVersion(): Promise<CatalogVersion> {
	if (cachedCatalogVersion) return cachedCatalogVersion;

	const resolved = "V1_CATALOG";
	cachedCatalogVersion = resolved;
	return resolved;
}

export async function getVisitorWixClient() {
	const cookieVal = (await cookies()).get(WIX_SESSION_COOKIE)?.value;
	const tokens = parseSessionTokens(cookieVal);

	const clientId = process.env.WIX_CLIENT_ID!;
	return createClient({
		modules: { currentCart },
		auth: OAuthStrategy({ clientId, tokens }), // <-- key part
		headers: { "wix-site-id": WIX_SITE_ID },
	});
}
