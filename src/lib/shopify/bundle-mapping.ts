import "server-only";

import { cache } from "react";

import type { Bundle } from "@/lib/catalog/types";
import { getBundleBySlug } from "@/lib/wix/bundles";

import { getVariantIdByProductHandle } from "./cart";

/**
 * Bundle mapping: Maps Wix bundle slugs to Shopify variant IDs
 *
 * This can be populated in three ways:
 * 1. Via CMS field: Add `shopifyVariantId` field to BookBundles CMS collection
 * 2. Via CMS field: Add `shopifyProductHandle` field (will query variant by handle)
 * 3. Via environment variable mapping: `SHOPIFY_BUNDLE_MAPPINGS` (JSON)
 *
 * Format for env var:
 * SHOPIFY_BUNDLE_MAPPINGS='{"bundle-slug-1":"gid://shopify/ProductVariant/123","bundle-slug-2":"gid://shopify/ProductVariant/456"}'
 */

/**
 * Parse bundle mappings from environment variable
 */
function getEnvironmentMappings(): Record<string, string> {
	const mappings = process.env.SHOPIFY_BUNDLE_MAPPINGS;
	if (!mappings) return {};

	try {
		return JSON.parse(mappings);
	} catch (error) {
		console.warn(
			"[Shopify Bundle Mapping] Failed to parse SHOPIFY_BUNDLE_MAPPINGS:",
			error
		);
		return {};
	}
}

/**
 * Get Shopify variant ID for a bundle slug
 * Checks in order:
 * 1. Environment variable mapping (cached)
 * 2. CMS field: shopifyVariantId
 * 3. CMS field: shopifyProductHandle (queries variant)
 */
export const getBundleShopifyVariantId = cache(
	async (bundleSlug: string): Promise<string | undefined> => {
		if (!bundleSlug) {
			console.warn("[Shopify Bundle Mapping] Bundle slug is empty");
			return undefined;
		}

		// Step 1: Check environment variable mappings
		const envMappings = getEnvironmentMappings();
		if (envMappings[bundleSlug]) {
			return envMappings[bundleSlug];
		}

		// Step 2: Check CMS data
		try {
			const bundle: Bundle | null = await getBundleBySlug(bundleSlug);
			if (!bundle) {
				console.warn(
					`[Shopify Bundle Mapping] Bundle not found: ${bundleSlug}`
				);
				return undefined;
			}

			// Check if CMS row has shopifyVariantId field
			const shopifyVariantId = bundle.shopifyVariantId;
			if (shopifyVariantId && typeof shopifyVariantId === "string") {
				return shopifyVariantId;
			}

			// Check if CMS row has shopifyProductHandle field (will query variant)
			const shopifyProductHandle = bundle.shopifyProductHandle;
			if (shopifyProductHandle && typeof shopifyProductHandle === "string") {
				const variantId =
					await getVariantIdByProductHandle(shopifyProductHandle);
				if (variantId) return variantId;
			}

			console.warn(
				`[Shopify Bundle Mapping] Bundle "${bundleSlug}" found but no shopifyVariantId or shopifyProductHandle set`
			);
			return undefined;
		} catch (error) {
			console.error(
				`[Shopify Bundle Mapping] Error fetching bundle "${bundleSlug}":`,
				error
			);
			return undefined;
		}
	}
);

/**
 * Get all bundle variant mappings (for pre-caching or debugging)
 */
export async function getAllBundleVariantMappings(): Promise<
	Record<string, string>
> {
	const envMappings = getEnvironmentMappings();
	return envMappings;
}

/**
 * Validate that a bundle slug has a Shopify variant ID configured
 */
export async function isBundleReadyForShopify(
	bundleSlug: string
): Promise<boolean> {
	try {
		const variantId = await getBundleShopifyVariantId(bundleSlug);
		return !!variantId;
	} catch {
		return false;
	}
}
