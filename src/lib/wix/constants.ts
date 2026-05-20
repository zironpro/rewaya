/** Wix Stores app definition ID — used in catalogReference.appId for add-to-cart */
export const WIX_STORES_APP_ID = "215238eb-22a5-4c36-9e7b-e7c08025e04e";

export const WIX_SITE_ID =
	process.env.NEXT_PUBLIC_WIX_SITE_ID ??
	process.env.WIX_SITE_ID ??
	"835db726-cfca-4ef4-8305-4002f5f62aef";

export function isWixCatalogEnabled(): boolean {
	return (
		process.env.USE_WIX_CATALOG !== "false" &&
		Boolean(process.env.WIX_CLIENT_ID)
	);
}
