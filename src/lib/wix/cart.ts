import "server-only";

import { currentCart } from "@wix/ecom";

import { getBundleBySlug } from "./bundles";
import type { ProductVariant } from "./catalog-types";
import { WIX_STORES_APP_ID } from "./constants";
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

async function resolveStoresVariant(
	productId: string
): Promise<ProductVariant | undefined> {
	const product = await getWixProductById(productId);
	if (!product?.id) return undefined;
	const variants = buildV3VariantsFromCatalog(product, product.variantId);
	return variants[0];
}

type WixSessionClient = Awaited<ReturnType<typeof getWixServerSessionClient>>;

function countCartLineItems(cart: unknown): number {
	if (!cart || typeof cart !== "object") return 0;
	const items = (cart as { lineItems?: unknown[] }).lineItems;
	return Array.isArray(items) ? items.length : 0;
}

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

async function addIncludedBooksToCart(
	client: WixSessionClient,
	productIds: string[],
	quantity = 1
) {
	const ids = [...new Set(productIds.map((id) => id.trim()).filter(Boolean))];
	if (ids.length === 0) {
		throw new Error("Bundle has no Stores product ids to add.");
	}

	const lineItems = await Promise.all(
		ids.map(async (productId) =>
			buildAddToCartLineItem(
				productId,
				await resolveStoresVariant(productId),
				quantity,
				WIX_STORES_APP_ID
			)
		)
	);

	const { cart } = await client.currentCart.addToCurrentCart({ lineItems });
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
	bundleSlug?: string;
	/** Only add the bundle SKU — never fall back to individual book line items. */
	bundleOnly?: boolean;
}

interface ResolvedBundleCheckout {
	catalogItemId: string;
	catalogAppId?: string;
}

async function resolveBundleCheckoutIds(
	catalogItemId: string,
	catalogAppId: string | undefined,
	bundleSlug?: string
): Promise<ResolvedBundleCheckout> {
	let resolvedItemId = catalogItemId.trim();
	let resolvedAppId = catalogAppId;

	if (bundleSlug) {
		const bundle = await getBundleBySlug(bundleSlug);
		if (bundle?.checkoutCatalogItemId) {
			resolvedItemId = bundle.checkoutCatalogItemId;
			resolvedAppId = bundle.checkoutCatalogAppId;
		}
	}

	if (!resolvedItemId) {
		throw new Error("Bundle has no checkout catalog item id.");
	}

	return { catalogItemId: resolvedItemId, catalogAppId: resolvedAppId };
}

async function tryAddBundlePrimary(
	client: WixSessionClient,
	checkout: ResolvedBundleCheckout,
	quantity: number
): Promise<{ cart: unknown; lineItems: number }> {
	const cart = await addBundleLineToCart(
		client,
		checkout.catalogItemId,
		quantity,
		checkout.catalogAppId
	);
	return { cart, lineItems: countCartLineItems(cart) };
}

async function tryRefetchCart(
	client: WixSessionClient
): Promise<{ cart: unknown; lineItems: number }> {
	const cart = await client.currentCart.getCurrentCart();
	return { cart, lineItems: countCartLineItems(cart) };
}

async function tryStoresBundleProduct(
	client: WixSessionClient,
	bundleProductId: string,
	quantity: number
): Promise<{ cart: unknown; lineItems: number } | null> {
	if (!bundleProductId.trim()) return null;
	const cart = await addBundleLineToCart(
		client,
		bundleProductId.trim(),
		quantity,
		WIX_STORES_APP_ID
	);
	const lineItems = countCartLineItems(cart);
	return lineItems > 0 ? { cart, lineItems } : null;
}

async function tryIncludedBooksFallback(
	client: WixSessionClient,
	storeProductIds: string[] | undefined,
	quantity: number
): Promise<{ cart: unknown; lineItems: number } | null> {
	if (!storeProductIds?.length) return null;
	const cart = await addIncludedBooksToCart(client, storeProductIds, quantity);
	const lineItems = countCartLineItems(cart);
	return lineItems > 0 ? { cart, lineItems } : null;
}

async function addBundleWithFallbacks(
	client: WixSessionClient,
	checkout: ResolvedBundleCheckout,
	quantity: number,
	bundleSlug?: string,
	bundleOnly = false
): Promise<unknown> {
	const bundle = bundleSlug ? await getBundleBySlug(bundleSlug) : null;

	let { cart, lineItems } = await tryAddBundlePrimary(
		client,
		checkout,
		quantity
	);

	if (lineItems === 0) {
		({ cart, lineItems } = await tryRefetchCart(client));
	}

	if (lineItems === 0 && bundle?.bundleProductId) {
		const storesId = bundle.bundleProductId.trim();
		const checkoutId = checkout.catalogItemId.trim();
		// Retry Stores SKU when primary used CMS catalog (or wrong id).
		if (storesId && storesId !== checkoutId) {
			const retry = await tryStoresBundleProduct(client, storesId, quantity);
			if (retry) ({ cart, lineItems } = retry);
		}
	}

	if (lineItems === 0 && !bundleOnly) {
		const fallback = await tryIncludedBooksFallback(
			client,
			bundle?.storeProductIds,
			quantity
		);
		if (fallback) ({ cart, lineItems } = fallback);
	}

	if (lineItems === 0) {
		throw new Error(
			bundleOnly
				? "Bundle was not added. Set bundleProductId on the BookBundles row in Wix to the bundle Stores product."
				: "Cart add returned no line items. Set bundleProductId on the BookBundles row in Wix, or run scripts/ensure-book-bundles-catalog.mjs."
		);
	}

	return cart;
}

/** Add one bundle line (Stores `bundleProductId` or BookBundles CMS catalog item). */
export async function addBundleToCartServer(
	catalogItemId: string,
	quantity = 1,
	catalogAppId?: string,
	options?: AddBundleToCartOptions
) {
	const checkout = await resolveBundleCheckoutIds(
		catalogItemId,
		catalogAppId,
		options?.bundleSlug
	);

	return withWixServerSessionClient(async (client) => {
		const bundleOnly = options?.bundleOnly ?? false;

		try {
			return await addBundleWithFallbacks(
				client,
				checkout,
				quantity,
				options?.bundleSlug,
				bundleOnly
			);
		} catch (primaryError) {
			if (!isCmsCatalogAppId(checkout.catalogAppId)) throw primaryError;

			const bundle = options?.bundleSlug
				? await getBundleBySlug(options.bundleSlug)
				: null;

			if (bundle?.bundleProductId?.trim()) {
				const retry = await tryStoresBundleProduct(
					client,
					bundle.bundleProductId,
					quantity
				);
				if (retry) return retry.cart;
			}

			if (!bundleOnly) {
				const booksFallback = await tryIncludedBooksFallback(
					client,
					bundle?.storeProductIds,
					quantity
				);
				if (booksFallback) return booksFallback.cart;
			}

			throw primaryError;
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
