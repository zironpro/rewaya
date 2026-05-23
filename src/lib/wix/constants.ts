/** Wix Stores app definition ID — used in catalogReference.appId for add-to-cart */
export const WIX_STORES_APP_ID = "215238eb-22a5-4c36-9e7b-e7c08025e04e";

export const WIX_SITE_ID =
	process.env.NEXT_PUBLIC_WIX_SITE_ID ??
	process.env.WIX_SITE_ID ??
	"835db726-cfca-4ef4-8305-4002f5f62aef";

/** Cookie storing Wix visitor/member OAuth tokens (JSON). */
export const WIX_SESSION_COOKIE = "wix_session";

/** sessionStorage key for OAuth PKCE data during Wix-managed login redirect. */
export const WIX_OAUTH_DATA_KEY = "wix_oauth_data";

export const AUTH_CALLBACK_PATH = "/auth/callback";

/** Wix CMS collection for member wishlist rows (memberId + productId). */
export const WISHLIST_COLLECTION = "Wishlist";

export function isWixCatalogEnabled(): boolean {
	return (
		process.env.USE_WIX_CATALOG !== "false" &&
		Boolean(process.env.WIX_CLIENT_ID)
	);
}

export function isWixAuthEnabled(): boolean {
	return Boolean(process.env.NEXT_PUBLIC_WIX_CLIENT_ID);
}
