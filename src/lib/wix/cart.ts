import "server-only";

import { currentCart } from "@wix/ecom";

import type { ProductVariant } from "./catalog-types";
import {
	buildAddToCartLineItem,
	buildBundleProductLineItem,
	buildCmsCatalogLineItem,
	isCmsCatalogAppId,
} from "./purchase-flow";
import { withWixServerSessionClient } from "./server-session-client";

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
	return withWixServerSessionClient(async (client) => {
		const { cart } = await client.currentCart.addToCurrentCart({
			lineItems: lines.map(({ productId, variant, quantity, catalogAppId }) =>
				isCmsCatalogAppId(catalogAppId)
					? buildCmsCatalogLineItem(productId, quantity)
					: buildAddToCartLineItem(productId, variant, quantity, catalogAppId)
			),
		});
		return cart;
	});
}

/** Add one bundle line (Stores `bundleProductId` or BookBundles CMS catalog item). */
export async function addBundleToCartServer(
	catalogItemId: string,
	quantity = 1,
	catalogAppId?: string
) {
	if (!catalogItemId) {
		throw new Error("Bundle has no checkout catalog item id.");
	}
	return withWixServerSessionClient(async (client) => {
		const lineItem = isCmsCatalogAppId(catalogAppId)
			? buildCmsCatalogLineItem(catalogItemId, quantity)
			: buildBundleProductLineItem(catalogItemId, quantity);
		const { cart } = await client.currentCart.addToCurrentCart({
			lineItems: [lineItem],
		});
		return cart;
	});
}

export async function getCartServer() {
	return withWixServerSessionClient(async (client) => {
		try {
			return await client.currentCart.getCurrentCart();
		} catch (error) {
			if (isOwnedCartNotFound(error)) return undefined;
			throw error;
		}
	});
}

export async function updateCartLineQuantityServer(
	lineId: string,
	quantity: number
) {
	return withWixServerSessionClient(async (client) => {
		const { cart } = await client.currentCart.updateCurrentCartLineItemQuantity(
			[{ _id: lineId, quantity }]
		);
		return cart;
	});
}

export async function removeFromCartServer(lineIds: string[]) {
	return withWixServerSessionClient(async (client) => {
		const { cart } =
			await client.currentCart.removeLineItemsFromCurrentCart(lineIds);
		return cart;
	});
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
	return withWixServerSessionClient(async (client) => {
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
	});
}
