import "server-only";

import { currentCart } from "@wix/ecom";

import type { ProductVariant } from "./catalog-types";
import {
	buildAddToCartLineItem,
	buildBundleLineItems,
	buildCmsCatalogLineItem,
	isCmsCatalogAppId,
} from "./purchase-flow";
import { getWixServerSessionClient } from "./server-session-client";

export interface AddToCartLineInput {
	productId: string;
	variant?: ProductVariant;
	quantity: number;
	catalogAppId?: string;
}

function isOwnedCartNotFound(error: unknown): boolean {
	const code = (error as { details?: { applicationError?: { code?: string } } })
		?.details?.applicationError?.code;
	return code === "OWNED_CART_NOT_FOUND";
}

export async function addToCartServer(lines: AddToCartLineInput[]) {
	const client = await getWixServerSessionClient();
	const { cart } = await client.currentCart.addToCurrentCart({
		lineItems: lines.map(({ productId, variant, quantity, catalogAppId }) =>
			isCmsCatalogAppId(catalogAppId)
				? buildCmsCatalogLineItem(productId, quantity)
				: buildAddToCartLineItem(productId, variant, quantity, catalogAppId)
		),
	});
	return cart;
}

/** Add all Wix Stores products linked to a BookBundles CMS row. */
export async function addBundleToCartServer(
	productIds: string[],
	quantity = 1
) {
	if (!productIds.length) {
		throw new Error("Bundle has no linked Wix Stores products.");
	}
	const client = await getWixServerSessionClient();
	const { cart } = await client.currentCart.addToCurrentCart({
		lineItems: buildBundleLineItems(productIds, quantity),
	});
	return cart;
}

export async function getCartServer() {
	const client = await getWixServerSessionClient();
	try {
		return await client.currentCart.getCurrentCart();
	} catch (error) {
		if (isOwnedCartNotFound(error)) return undefined;
		throw error;
	}
}

export async function updateCartLineQuantityServer(
	lineId: string,
	quantity: number
) {
	const client = await getWixServerSessionClient();
	const { cart } = await client.currentCart.updateCurrentCartLineItemQuantity([
		{ _id: lineId, quantity },
	]);
	return cart;
}

export async function removeFromCartServer(lineIds: string[]) {
	const client = await getWixServerSessionClient();
	const { cart } =
		await client.currentCart.removeLineItemsFromCurrentCart(lineIds);
	return cart;
}

export interface CheckoutRedirectOptions {
	origin: string;
	postFlowUrl?: string;
	thankYouPageUrl?: string;
	cartPageUrl?: string;
}

export async function createCheckoutUrlServer(
	options: CheckoutRedirectOptions
): Promise<string | undefined> {
	const client = await getWixServerSessionClient();
	const origin = options.origin.replace(/\/$/, "");

	const tryCheckout = async (channelType: currentCart.ChannelType) => {
		const { checkoutId } =
			await client.currentCart.createCheckoutFromCurrentCart({ channelType });
		const { redirectSession } = await client.redirects.createRedirectSession({
			ecomCheckout: { checkoutId },
			callbacks: {
				postFlowUrl: options.postFlowUrl ?? `${origin}/shop`,
				thankYouPageUrl: options.thankYouPageUrl ?? `${origin}/thank-you`,
				cartPageUrl: options.cartPageUrl ?? `${origin}/cart`,
			},
		});
		return redirectSession?.fullUrl;
	};

	try {
		return await tryCheckout(currentCart.ChannelType.OTHER_PLATFORM);
	} catch {
		return tryCheckout(currentCart.ChannelType.WEB);
	}
}
