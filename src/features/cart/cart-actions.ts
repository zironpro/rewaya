"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { isAvailableForPurchase } from "@/lib/wix/availability";
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

export async function fetchCart(): Promise<unknown | null> {
	try {
		return (await getCartServer()) ?? null;
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
	item: { productIds: string[]; quantity?: number }
): Promise<CartActionResult> {
	const productIds = (item.productIds ?? []).filter(Boolean);
	if (!productIds.length) {
		return {
			error:
				"This bundle has no linked products. Link books in the BookBundles collection.",
		};
	}

	try {
		const cart = await addBundleToCartServer(productIds, item.quantity ?? 1);
		revalidatePath("/", "layout");
		return { error: null, cart };
	} catch (e) {
		console.error("[cart] addBundle failed:", e);
		return { error: "Could not add bundle to cart. Please try again." };
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
		return { error: null, cart };
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
		return { error: null, cart };
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
