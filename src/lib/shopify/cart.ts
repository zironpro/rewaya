import "server-only";

import type { Maybe, Product } from "@/types/shopify-storefront-graphql";

import { getBundleShopifyVariantId } from "./bundle-mapping";
import {
	CHECKOUT_CREATE_MUTATION,
	CHECKOUT_LINE_ITEMS_ADD_MUTATION,
	GET_PRODUCT_VARIANTS_BY_HANDLE_QUERY,
} from "./checkout-mutations";
import { fetchGraphQL } from "./client";

export interface ShopifyCheckoutError {
	code: string;
	message: string;
	field?: string[];
}

interface ShopifyCheckoutResponse {
	checkoutCreate?: {
		checkout: {
			id: string;
			webUrl: string;
			lineItems: {
				edges: Array<{
					node: {
						id: string;
						title: string;
						quantity: number;
						variantTitle: string;
					};
				}>;
			};
		};
		checkoutUserErrors: ShopifyCheckoutError[];
	};
	checkoutLineItemsAdd?: {
		checkout: {
			id: string;
			webUrl: string;
			lineItems: {
				edges: Array<{
					node: {
						id: string;
						title: string;
						quantity: number;
					};
				}>;
			};
		};
		checkoutUserErrors: ShopifyCheckoutError[];
	};
}

/**
 * Create a new checkout (cart session) in Shopify
 */
export async function createOrGetCheckout(): Promise<{
	checkoutId: string;
	webUrl: string;
}> {
	try {
		const response = await fetchGraphQL<ShopifyCheckoutResponse>(
			CHECKOUT_CREATE_MUTATION,
			{
				input: {},
			}
		);

		const checkout = response.checkoutCreate?.checkout;
		const errors = response.checkoutCreate?.checkoutUserErrors;

		if (errors && errors.length > 0) {
			console.error("[Shopify] Checkout creation errors:", errors);
			throw new Error(`Failed to create checkout: ${errors[0]?.message}`);
		}

		if (!checkout?.id || !checkout?.webUrl) {
			throw new Error("Failed to create checkout: no checkout ID or webUrl");
		}

		return {
			checkoutId: checkout.id,
			webUrl: checkout.webUrl,
		};
	} catch (error) {
		console.error("[Shopify] createOrGetCheckout error:", error);
		throw error;
	}
}

/**
 * Add a line item (variant) to a Shopify checkout
 */
export async function addToCheckout(
	checkoutId: string,
	variantId: string,
	quantity: number
): Promise<{
	checkoutId: string;
	webUrl: string;
	lineItemCount: number;
}> {
	if (!checkoutId) {
		throw new Error("Checkout ID is required");
	}
	if (!variantId) {
		throw new Error("Variant ID is required");
	}
	if (quantity <= 0) {
		throw new Error("Quantity must be greater than 0");
	}

	try {
		const response = await fetchGraphQL<ShopifyCheckoutResponse>(
			CHECKOUT_LINE_ITEMS_ADD_MUTATION,
			{
				checkoutId,
				lineItems: [
					{
						variantId,
						quantity,
					},
				],
			}
		);

		const checkout = response.checkoutLineItemsAdd?.checkout;
		const errors = response.checkoutLineItemsAdd?.checkoutUserErrors;

		if (errors && errors.length > 0) {
			console.error("[Shopify] Line item add errors:", errors);
			throw new Error(`Failed to add to checkout: ${errors[0]?.message}`);
		}

		if (!checkout?.id || !checkout?.webUrl) {
			throw new Error("Failed to add item to checkout");
		}

		const lineItemCount = checkout.lineItems.edges.length;

		return {
			checkoutId: checkout.id,
			webUrl: checkout.webUrl,
			lineItemCount,
		};
	} catch (error) {
		console.error("[Shopify] addToCheckout error:", error);
		throw error;
	}
}

/**
 * Add a bundle to Shopify checkout by bundle slug
 * Resolves the bundle slug to a Shopify variant ID and adds it to the checkout
 */
export async function addBundleToCheckout(
	checkoutId: string,
	bundleSlug: string,
	quantity = 1
): Promise<{
	checkoutId: string;
	webUrl: string;
	lineItemCount: number;
}> {
	// Get the Shopify variant ID from the bundle mapping
	const variantId = await getBundleShopifyVariantId(bundleSlug);

	if (!variantId) {
		throw new Error(
			`Bundle "${bundleSlug}" not found in Shopify or missing shopifyVariantId mapping`
		);
	}

	return addToCheckout(checkoutId, variantId, quantity);
}

/**
 * Get the checkout URL from a Shopify checkout ID
 */
export function getCheckoutUrlFromId(checkoutId: string): string {
	// Shopify checkout URL format: checkout ID contains the full URL path already
	// But we store just the webUrl from checkout responses
	// This is a fallback - typically we get webUrl from checkout responses
	if (!checkoutId) {
		throw new Error("Checkout ID is required");
	}
	// In practice, we should always have webUrl from checkout operations
	// This function is here for reference
	return checkoutId;
}

/**
 * Create a bundle checkout in one flow:
 * 1. Create a new checkout
 * 2. Add the bundle to it
 * 3. Return the checkout URL
 */
export async function createBundleCheckout(
	bundleSlug: string,
	quantity = 1
): Promise<string> {
	try {
		// Step 1: Create checkout
		const { checkoutId, webUrl } = await createOrGetCheckout();

		// Step 2: Add bundle to checkout
		await addBundleToCheckout(checkoutId, bundleSlug, quantity);

		// Step 3: Return the checkout URL
		return webUrl;
	} catch (error) {
		console.error("[Shopify] createBundleCheckout error:", error);
		throw error;
	}
}

/**
 * Get the Shopify variant ID for a bundle by querying the product handle
 * This is used internally by bundle mapping
 */
export async function getVariantIdByProductHandle(
	productHandle: string,
	variantSku?: string
): Promise<string | undefined> {
	try {
		const response = await fetchGraphQL<{ productByHandle?: Maybe<Product> }>(
			GET_PRODUCT_VARIANTS_BY_HANDLE_QUERY,
			{ handle: productHandle }
		);

		const product = response.productByHandle;
		if (!product) {
			throw new Error(`Product with handle "${productHandle}" not found`);
		}

		// If specific SKU requested, find that variant
		if (variantSku) {
			const variant = product.variants?.edges?.find(
				(edge) => edge?.node?.sku === variantSku
			);
			return variant?.node?.id;
		}

		// Otherwise return first variant
		return product.variants?.edges?.[0]?.node?.id;
	} catch (error) {
		console.error("[Shopify] getVariantIdByProductHandle error:", error);
		throw error;
	}
}
