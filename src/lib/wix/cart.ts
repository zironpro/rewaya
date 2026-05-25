import "server-only";

import { currentCart } from "@wix/ecom";

import { getBundleBySlug } from "./bundles";
import type { ProductVariant } from "./catalog-types";
import { getWixProductById } from "./products";
import {
	buildAddToCartLineItem,
	buildCmsCatalogLineItem,
	isCmsCatalogAppId,
} from "./purchase-flow";
import { buildV3VariantsFromCatalog } from "./reshape-product";
import {
	getWixServerSessionClient,
	withWixServerSessionClient,
} from "./server-session-client";

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

function getWixErrorCode(error: unknown): string | undefined {
	return (error as { details?: { applicationError?: { code?: string } } })
		?.details?.applicationError?.code;
}

async function resolveStoresVariant(
	productId: string
): Promise<ProductVariant | undefined> {
	const product = await getWixProductById(productId);
	if (!product?.id) return undefined;
	const variants = buildV3VariantsFromCatalog(product, product.variantId);
	return variants[0];
}

type WixSessionClient = Awaited<ReturnType<typeof getWixServerSessionClient>>;

async function addBundleLineToCart(
	client: WixSessionClient,
	catalogItemId: string,
	quantity: number,
	catalogAppId?: string
) {
	const lineItem = isCmsCatalogAppId(catalogAppId)
		? buildCmsCatalogLineItem(catalogItemId, quantity)
		: buildAddToCartLineItem(
				catalogItemId,
				await resolveStoresVariant(catalogItemId),
				quantity,
				catalogAppId
			);
	const { cart } = await client.currentCart.addToCurrentCart({
		lineItems: [lineItem],
	});
	return cart;
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

export interface AddBundleToCartOptions {
	quantity?: number;
	catalogAppId?: string;
	/** Re-resolve checkout ids from latest CMS + Stores lookup at click time. */
	bundleSlug?: string;
}

/** Add one bundle line (Stores `bundleProductId` or BookBundles CMS catalog item). */
export async function addBundleToCartServer(
	catalogItemId: string,
	quantity = 1,
	catalogAppId?: string,
	options?: AddBundleToCartOptions
) {
	let resolvedItemId = catalogItemId?.trim();
	let resolvedAppId = catalogAppId;

	if (options?.bundleSlug) {
		const bundle = await getBundleBySlug(options.bundleSlug);
		if (bundle?.checkoutCatalogItemId) {
			resolvedItemId = bundle.checkoutCatalogItemId;
			resolvedAppId = bundle.checkoutCatalogAppId;
		}
	}

	if (!resolvedItemId) {
		throw new Error("Bundle has no checkout catalog item id.");
	}

	return withWixServerSessionClient(async (client) => {
		try {
			return await addBundleLineToCart(
				client,
				resolvedItemId,
				quantity,
				resolvedAppId
			);
		} catch (primaryError) {
			if (!isCmsCatalogAppId(resolvedAppId)) throw primaryError;

			const bundle = options?.bundleSlug
				? await getBundleBySlug(options.bundleSlug)
				: null;
			const storesProductId = bundle?.bundleProductId?.trim();
			if (!storesProductId) throw primaryError;

			if (process.env.NODE_ENV === "development") {
				console.warn(
					"[cart] CMS catalog add failed, retrying Stores bundle product:",
					getWixErrorCode(primaryError),
					storesProductId
				);
			}

			return addBundleLineToCart(client, storesProductId, quantity, undefined);
		}
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
