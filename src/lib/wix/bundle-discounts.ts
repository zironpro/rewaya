import "server-only";

import { WIX_STORES_APP_ID } from "./constants";

export const BUNDLE_DISCOUNT_RULE_PREFIX = "Rewaya Bundle:";

export interface BundleDiscountInput {
	bundleTitle: string;
	bundleProductId: string;
	salePrice: number;
	originalPrice: number;
}

/** Scope + discount payload for one bundle Stores product (automatic discount at checkout). */
export function buildBundleDiscountRulePayload({
	bundleTitle,
	bundleProductId,
	salePrice,
	originalPrice,
}: BundleDiscountInput) {
	const listPrice = originalPrice > 0 ? originalPrice : salePrice;
	const discountAmount = Math.max(0, listPrice - salePrice);

	const scope = {
		id: `specific_${WIX_STORES_APP_ID}`,
		type: "CATALOG_ITEM" as const,
		catalogItemFilter: {
			catalogAppId: WIX_STORES_APP_ID,
			catalogItemIds: [bundleProductId],
		},
	};

	const name = `${BUNDLE_DISCOUNT_RULE_PREFIX} ${bundleTitle}`.slice(0, 80);

	if (discountAmount <= 0) {
		return null;
	}

	return {
		discountRule: {
			name,
			active: true,
			discounts: [
				{
					discount: {
						discountType: "FIXED_AMOUNT" as const,
						fixedAmount: discountAmount.toFixed(2),
					},
					scope,
				},
			],
		},
	};
}

/** List price on the Stores SKU should match `originalPrice` so the fixed discount reaches `salePrice`. */
export function bundleStoresListPrice(
	salePrice: number,
	originalPrice: number
): number {
	return originalPrice > salePrice ? originalPrice : salePrice;
}
