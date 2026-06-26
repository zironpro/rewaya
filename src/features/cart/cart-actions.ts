"use server";

import { redirect } from "next/navigation";

import { messageForAddBundleError } from "@/features/cart/cart-errors";
import { enrichCartWithBundles } from "@/features/cart/enrich-cart";
import { isBundleReadyForShopify } from "@/lib/shopify/bundle-mapping";
import { createBundleCheckout } from "@/lib/shopify/cart";
import { isAvailableForPurchase } from "@/lib/wix/availability";
import { getCachedBundles } from "@/lib/wix/bundles";
import {
	addBundleToCartServer,
	addToCartServer,
	createCheckoutUrlServer,
	getCartServer,
	removeFromCartServer,
	updateCartLineQuantityServer,
} from "@/lib/wix/cart";
import type { ProductVariant } from "@/lib/wix/catalog-types";
import {
	type CheckoutDebugPayload,
	checkoutDebug,
	isCheckoutDebugEnabled,
	serializeWixError,
} from "@/lib/wix/checkout-debug";
import { resolveCheckoutOrigin } from "@/lib/wix/checkout-origin";
import { isCmsCatalogAppId } from "@/lib/wix/purchase-flow";

export type CartActionResult = {
	error: string | null;
	cart?: unknown;
};

async function enrichCartResponse(cart: unknown | null | undefined) {
	if (!cart) return cart ?? null;
	try {
		const bundles = await getCachedBundles();
		return enrichCartWithBundles(cart, bundles);
	} catch {
		return cart;
	}
}

export async function fetchCart(): Promise<unknown | null> {
	try {
		const cart = await getCartServer();
		return enrichCartResponse(cart ?? null);
	} catch (e) {
		console.error("[cart] fetchCart failed:", e);
		return null;
	}
}

export async function addItem(
	_prevState: unknown,
	item: {
		productId: string;
		variant?: ProductVariant;
		availableForSale?: boolean;
		quantity?: number;
		catalogAppId?: string;
	}
): Promise<CartActionResult> {
	if (!item.productId) {
		return { error: "Missing product" };
	}

	if (
		!isCmsCatalogAppId(item.catalogAppId) &&
		!isAvailableForPurchase(item.availableForSale, item.variant)
	) {
		return { error: "This item is out of stock." };
	}

	try {
		const cart = await addToCartServer([
			{
				productId: item.productId,
				variant: item.variant,
				quantity: item.quantity ?? 1,
				catalogAppId: item.catalogAppId,
			},
		]);
		return { error: null, cart: await enrichCartResponse(cart) };
	} catch (e) {
		console.error("[cart] addItem failed:", e);
		return { error: "Could not add to cart. Please try again." };
	}
}

export async function addBundle(
	_prevState: unknown,
	item: {
		catalogItemId: string;
		catalogAppId?: string;
		quantity?: number;
		/** Bundle slug — re-resolves Stores product id before add. */
		bundleSlug?: string;
	}
): Promise<CartActionResult> {
	const catalogItemId = item.catalogItemId?.trim();
	const bundleSlug = item.bundleSlug?.trim();

	console.log("[bundle-cart] addBundle (server action)", {
		catalogItemId: catalogItemId || "(empty)",
		catalogAppId: item.catalogAppId ?? "(none)",
		bundleSlug: bundleSlug || "(none)",
		quantity: item.quantity ?? 1,
	});

	if (!catalogItemId && !bundleSlug) {
		console.warn(
			"[bundle-cart] rejected — missing catalogItemId and bundleSlug"
		);
		return {
			error: "This bundle is not available for purchase.",
		};
	}

	// Check if this bundle is configured for Shopify
	if (bundleSlug) {
		const useShopify = await isBundleReadyForShopify(bundleSlug);
		if (useShopify) {
			console.log("[bundle-cart] Using Shopify for bundle:", bundleSlug);
			try {
				// For Shopify bundles, we don't actually add to cart here
				// We just validate that it exists. The checkout flow will handle it.
				// Return success to allow checkout flow to proceed
				return {
					error: null,
					cart: {
						isShopifyBundle: true,
						bundleSlug,
						quantity: item.quantity ?? 1,
					} as unknown,
				};
			} catch (e) {
				console.error("[bundle-cart] Shopify validation failed:", e);
				// Fall through to Wix
			}
		}
	}

	// Fall back to Wix for bundles not ready for Shopify
	try {
		const cart = await addBundleToCartServer(
			catalogItemId,
			item.quantity ?? 1,
			item.catalogAppId,
			{
				bundleSlug,
				// Never add individual book lines — wrong total; use Stores bundle SKU + discount rules.
				bundleOnly: true,
			}
		);
		const enriched = await enrichCartResponse(cart);
		const lineCount =
			(enriched as { lineItems?: unknown[] })?.lineItems?.length ?? 0;
		console.log("[bundle-cart] addBundle OK (Wix)", { lineItems: lineCount });
		if (lineCount === 0) {
			return {
				error:
					"Bundle was not added to the cart (0 line items). Set bundleProductId on the BookBundles row in Wix.",
			};
		}
		return { error: null, cart: enriched };
	} catch (e) {
		console.error("[bundle-cart] addBundle failed:", e);
		return { error: messageForAddBundleError(e) };
	}
}

export async function updateItemQuantity(
	_prevState: unknown,
	payload: { lineId: string; quantity: number }
): Promise<CartActionResult> {
	try {
		const cart =
			payload.quantity < 1
				? await removeFromCartServer([payload.lineId])
				: await updateCartLineQuantityServer(payload.lineId, payload.quantity);
		return { error: null, cart: await enrichCartResponse(cart) };
	} catch (e) {
		console.error("[cart] update quantity failed:", e);
		return { error: "Could not update quantity." };
	}
}

export async function removeItem(
	_prevState: unknown,
	lineId: string
): Promise<CartActionResult> {
	try {
		const cart = await removeFromCartServer([lineId]);
		return { error: null, cart: await enrichCartResponse(cart) };
	} catch (e) {
		console.error("[cart] remove failed:", e);
		return { error: "Could not remove item." };
	}
}

export type BundleCheckoutResult = {
	ok: boolean;
	checkoutUrl?: string;
	error?: string;
	debug?: CheckoutDebugPayload;
};

export async function getCheckoutUrl(
	originOverride?: string
): Promise<BundleCheckoutResult> {
	const origin = await resolveCheckoutOrigin(originOverride);
	const debug: CheckoutDebugPayload = { step: "resolve-origin", origin };

	try {
		// For now, getCheckoutUrl uses Wix (legacy behavior)
		// If you need Shopify support here, call startBundleCheckout with bundleSlug instead
		const checkoutUrl = await createCheckoutUrlServer({ origin });
		if (!checkoutUrl) {
			const message =
				"Checkout URL was not returned. Ensure the cart has items and Wix eCommerce is enabled.";
			console.error("[checkout] missing redirect URL", { origin });
			return {
				ok: false,
				error: message,
				debug: isCheckoutDebugEnabled()
					? { ...debug, step: "redirect-session", error: { message } }
					: undefined,
			};
		}
		return {
			ok: true,
			checkoutUrl,
			debug: isCheckoutDebugEnabled()
				? { ...debug, step: "complete", checkoutUrl }
				: undefined,
		};
	} catch (error) {
		console.error("[checkout] getCheckoutUrl failed:", error);
		return {
			ok: false,
			error: "Could not start checkout. Please try again.",
			debug: isCheckoutDebugEnabled()
				? {
						...debug,
						step: "create-checkout",
						error: serializeWixError(error),
					}
				: undefined,
		};
	}
}

/** Add bundle to cart, then return checkout URL (Shopify or Wix hosted). */
export async function startBundleCheckout(
	item: {
		catalogItemId: string;
		catalogAppId?: string;
		bundleSlug?: string;
		quantity?: number;
	},
	originOverride?: string
): Promise<BundleCheckoutResult> {
	const origin = await resolveCheckoutOrigin(originOverride);
	const catalogItemId = item.catalogItemId?.trim();
	const bundleSlug = item.bundleSlug?.trim();
	const debug: CheckoutDebugPayload = {
		step: "resolve-origin",
		origin,
		bundleSlug,
		catalogItemId: catalogItemId || undefined,
		catalogAppId: item.catalogAppId,
	};

	checkoutDebug("startBundleCheckout", {
		origin,
		bundleSlug,
		catalogItemId,
	});

	if (!catalogItemId && !bundleSlug) {
		return {
			ok: false,
			error: "This bundle is not available for purchase.",
			debug: isCheckoutDebugEnabled() ? debug : undefined,
		};
	}

	// Check if this bundle is configured for Shopify
	if (bundleSlug) {
		const useShopify = await isBundleReadyForShopify(bundleSlug);
		if (useShopify) {
			console.log("[checkout] Using Shopify for bundle:", bundleSlug);
			try {
				const checkoutUrl = await createBundleCheckout(
					bundleSlug,
					item.quantity ?? 1
				);

				return {
					ok: true,
					checkoutUrl,
					debug: isCheckoutDebugEnabled()
						? { ...debug, step: "complete", checkoutUrl }
						: undefined,
				};
			} catch (error) {
				console.error("[checkout] Shopify createBundleCheckout failed:", error);
				return {
					ok: false,
					error: `Shopify checkout failed: ${error instanceof Error ? error.message : String(error)}`,
					debug: isCheckoutDebugEnabled()
						? {
								...debug,
								step: "create-checkout",
								error: serializeWixError(error),
							}
						: undefined,
				};
			}
		}
	}

	// Fall back to Wix checkout for bundles not ready for Shopify
	try {
		const cart = await addBundleToCartServer(
			catalogItemId,
			item.quantity ?? 1,
			item.catalogAppId,
			{
				bundleSlug,
				bundleOnly: true,
			}
		);
		const lineItemCount =
			(cart as { lineItems?: unknown[] })?.lineItems?.length ?? 0;
		debug.step = "add-bundle";
		debug.lineItemCount = lineItemCount;
		checkoutDebug("bundle added", { lineItemCount });

		if (lineItemCount === 0) {
			return {
				ok: false,
				error:
					"Bundle was not added to the cart (0 line items). Set bundleProductId on the BookBundles row in Wix.",
				debug: isCheckoutDebugEnabled() ? debug : undefined,
			};
		}

		const checkoutUrl = await createCheckoutUrlServer({ origin });
		if (!checkoutUrl) {
			return {
				ok: false,
				error:
					"Checkout URL was not returned. Check Wix Headless checkout settings and cart contents.",
				debug: isCheckoutDebugEnabled()
					? { ...debug, step: "redirect-session" }
					: undefined,
			};
		}

		return {
			ok: true,
			checkoutUrl,
			debug: isCheckoutDebugEnabled()
				? { ...debug, step: "complete", checkoutUrl }
				: undefined,
		};
	} catch (error) {
		console.error("[checkout] startBundleCheckout (Wix) failed:", error);
		return {
			ok: false,
			error: messageForAddBundleError(error),
			debug: isCheckoutDebugEnabled()
				? {
						...debug,
						step: "add-bundle",
						error: serializeWixError(error),
					}
				: undefined,
		};
	}
}

export async function redirectToCheckout(originOverride?: string) {
	const result = await getCheckoutUrl(originOverride);
	if (result.ok && result.checkoutUrl) {
		checkoutDebug("redirecting", { checkoutUrl: result.checkoutUrl });
		redirect(result.checkoutUrl);
	}
	console.error("[checkout] redirectToCheckout aborted — no URL", result.debug);
}
