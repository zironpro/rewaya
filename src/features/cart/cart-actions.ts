"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { messageForAddBundleError } from "@/features/cart/cart-errors";
import { enrichCartWithBundles } from "@/features/cart/enrich-cart";
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
		revalidatePath("/", "layout");
		return { error: null, cart };
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
	console.log("[bundle-cart] addBundle (server action)", {
		catalogItemId: catalogItemId || "(empty)",
		catalogAppId: item.catalogAppId ?? "(none)",
		bundleSlug: item.bundleSlug ?? "(none)",
		quantity: item.quantity ?? 1,
	});

	if (!catalogItemId && !item.bundleSlug?.trim()) {
		console.warn(
			"[bundle-cart] rejected — missing catalogItemId and bundleSlug"
		);
		return {
			error: "This bundle is not available for purchase.",
		};
	}

	try {
		const cart = await addBundleToCartServer(
			catalogItemId,
			item.quantity ?? 1,
			item.catalogAppId,
			{
				bundleSlug: item.bundleSlug?.trim(),
				// Never add individual book lines — wrong total; use Stores bundle SKU + discount rules.
				bundleOnly: true,
			}
		);
		const enriched = await enrichCartResponse(cart);
		const lineCount =
			(enriched as { lineItems?: unknown[] })?.lineItems?.length ?? 0;
		console.log("[bundle-cart] addBundle OK", { lineItems: lineCount });
		if (lineCount === 0) {
			return {
				error:
					"Bundle was not added to the cart (0 line items). Set bundleProductId on the BookBundles row in Wix.",
			};
		}
		revalidatePath("/", "layout");
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
		revalidatePath("/", "layout");
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
		revalidatePath("/", "layout");
		return { error: null, cart: await enrichCartResponse(cart) };
	} catch (e) {
		console.error("[cart] remove failed:", e);
		return { error: "Could not remove item." };
	}
}

export async function redirectToCheckout() {
	const headersList = await headers();
	const referer = headersList.get("referer");
	const origin = referer
		? new URL(referer).origin
		: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");

	const checkoutUrl = await createCheckoutUrlServer({ origin });
	if (checkoutUrl) redirect(checkoutUrl);
}
