import { PLACEHOLDER_VARIANT_ID, type ProductVariant } from "./catalog-types";
import { WIX_STORES_APP_ID } from "./constants";

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
	variant?: ProductVariant
) {
	const catalogOptions = buildCatalogReferenceOptions(variant);
	return {
		appId: WIX_STORES_APP_ID,
		catalogItemId,
		...(catalogOptions ? { options: catalogOptions } : {}),
	};
}

export function buildAddToCartLineItem(
	catalogItemId: string,
	variant: ProductVariant | undefined,
	quantity: number
) {
	return {
		catalogReference: buildCatalogReference(catalogItemId, variant),
		quantity,
	};
}
