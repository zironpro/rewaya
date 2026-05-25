import { PLACEHOLDER_VARIANT_ID, type ProductVariant } from "./catalog-types";
import { WIX_CMS_CATALOG_APP_ID, WIX_STORES_APP_ID } from "./constants";

export interface CatalogReferenceOptions {
	variantId?: string;
	options?: Record<string, string>;
}

/** Build catalogReference.options per Wix headless-templates commerce. */
export function buildCatalogReferenceOptions(
	variant?: ProductVariant
): CatalogReferenceOptions | undefined {
	if (!variant) return undefined;

	if (variant.id === PLACEHOLDER_VARIANT_ID) {
		const options = variant.selectedOptions.reduce(
			(acc, option) => {
				if (option.name && option.value) {
					acc[option.name] = option.value;
				}
				return acc;
			},
			{} as Record<string, string>
		);
		if (Object.keys(options).length === 0) return undefined;
		return { options };
	}

	return { variantId: variant.id };
}

export function buildCatalogReference(
	catalogItemId: string,
	variant?: ProductVariant,
	appId: string = WIX_STORES_APP_ID
) {
	const catalogOptions = buildCatalogReferenceOptions(variant);
	return {
		appId,
		catalogItemId,
		...(catalogOptions ? { options: catalogOptions } : {}),
	};
}

export function buildAddToCartLineItem(
	catalogItemId: string,
	variant: ProductVariant | undefined,
	quantity: number,
	appId?: string
) {
	return {
		catalogReference: buildCatalogReference(
			catalogItemId,
			variant,
			appId ?? WIX_STORES_APP_ID
		),
		quantity,
	};
}

export interface BundleCheckoutRef {
	checkoutCatalogItemId: string;
	checkoutCatalogAppId: string;
}

/** Stores bundle product, else BookBundles CMS catalog item (single line, bundle price). */
export function resolveBundleCheckout(input: {
	bundleProductId?: string;
	cmsCatalogItemId: string;
}): BundleCheckoutRef {
	const storesId = input.bundleProductId?.trim();
	if (storesId) {
		return {
			checkoutCatalogItemId: storesId,
			checkoutCatalogAppId: WIX_STORES_APP_ID,
		};
	}
	return {
		checkoutCatalogItemId: input.cmsCatalogItemId,
		checkoutCatalogAppId: WIX_CMS_CATALOG_APP_ID,
	};
}

/** Single Stores line for a BookBundles row (discounted bundle product). */
export function buildBundleProductLineItem(
	bundleProductId: string,
	quantity = 1
) {
	return buildAddToCartLineItem(bundleProductId, undefined, quantity);
}

/** @deprecated Use `buildBundleProductLineItem` — adds N book lines, not bundle price. */
export function buildBundleLineItems(
	productIds: string[],
	quantity = 1
) {
	return productIds.map((productId) =>
		buildAddToCartLineItem(productId, undefined, quantity)
	);
}

/** BookBundles CMS catalog rows — no Stores variants. */
export function buildCmsCatalogLineItem(cmsItemId: string, quantity: number) {
	return {
		catalogReference: {
			appId: WIX_CMS_CATALOG_APP_ID,
			catalogItemId: cmsItemId,
		},
		quantity,
	};
}

export function isCmsCatalogAppId(appId?: string): boolean {
	return appId === WIX_CMS_CATALOG_APP_ID;
}
