import type { ProductVariant } from "./catalog-types";

export function isAvailableForPurchase(
	availableForSale?: boolean,
	variant?: ProductVariant
): boolean {
	return availableForSale !== false && variant?.availableForSale !== false;
}
