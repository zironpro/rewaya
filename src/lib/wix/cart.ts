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

/** Fallback when CMS catalog returns an empty cart — adds each included Stores book. */
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
			console.log("[bundle-cart] re-resolved from slug", {
				bundleSlug: options.bundleSlug,
				bundleProductId: bundle.bundleProductId || "(none)",
				checkoutCatalogItemId: resolvedItemId,
				checkoutCatalogAppId: resolvedAppId,
				path: isCmsCatalogAppId(resolvedAppId) ? "cms-catalog" : "stores",
			});
		}
	}

	if (!resolvedItemId) {
		console.error("[bundle-cart] no checkout catalog item id");
		throw new Error("Bundle has no checkout catalog item id.");
	}

	console.log("[bundle-cart] calling Wix addToCurrentCart", {
		catalogItemId: resolvedItemId,
		catalogAppId: resolvedAppId ?? "(stores default)",
		quantity,
		path: isCmsCatalogAppId(resolvedAppId) ? "cms-catalog" : "stores",
	});

	return withWixServerSessionClient(async (client) => {
		const bundle = options?.bundleSlug
			? await getBundleBySlug(options.bundleSlug)
			: null;

		const finish = (cart: unknown, label: string) => {
			const lineItems = countCartLineItems(cart);
			console.log(`[bundle-cart] ${label}`, {
				lineItems,
				cartId: (cart as { _id?: string })?._id,
			});
			return { cart, lineItems };
		};

		try {
			let { cart, lineItems } = finish(
				await addBundleLineToCart(
					client,
					resolvedItemId,
					quantity,
					resolvedAppId
				),
				"Wix addToCurrentCart (primary)"
			);

			if (lineItems === 0) {
				const refetched = await client.currentCart.getCurrentCart();
				({ cart, lineItems } = finish(
					refetched,
					"getCurrentCart after empty add"
				));
			}

			if (lineItems === 0 && bundle?.bundleProductId?.trim()) {
				console.warn("[bundle-cart] retrying Stores bundleProductId");
				({ cart, lineItems } = finish(
					await addBundleLineToCart(
						client,
						bundle.bundleProductId.trim(),
						quantity,
						WIX_STORES_APP_ID
					),
					"Stores bundleProductId"
				));
			}

			if (lineItems === 0 && bundle?.storeProductIds?.length) {
				console.warn(
					"[bundle-cart] CMS catalog returned 0 lines — adding included books",
					{ count: bundle.storeProductIds.length }
				);
				({ cart, lineItems } = finish(
					await addIncludedBooksToCart(
						client,
						bundle.storeProductIds,
						quantity
					),
					"included Books (Stores fallback)"
				));
			}

			if (lineItems === 0) {
				console.error("[bundle-cart] cart still empty after all attempts", {
					bundleProductId: bundle?.bundleProductId || "(none)",
					includedBooks: bundle?.storeProductIds?.length ?? 0,
				});
				throw new Error(
					"Cart add returned no line items. Set bundleProductId on the BookBundles row in Wix, or run scripts/ensure-book-bundles-catalog.mjs."
				);
			}

			return cart;
		} catch (primaryError) {
			console.error("[bundle-cart] Wix add failed", {
				code: getWixErrorCode(primaryError),
				error: primaryError,
			});

			if (!isCmsCatalogAppId(resolvedAppId)) throw primaryError;

			const storesProductId = bundle?.bundleProductId?.trim();
			if (storesProductId) {
				const { cart, lineItems } = finish(
					await addBundleLineToCart(
						client,
						storesProductId,
						quantity,
						WIX_STORES_APP_ID
					),
					"Stores retry after error"
				);
				if (lineItems > 0) return cart;
			}

			if (bundle?.storeProductIds?.length) {
				const { cart, lineItems } = finish(
					await addIncludedBooksToCart(
						client,
						bundle.storeProductIds,
						quantity
					),
					"included books after error"
				);
				if (lineItems > 0) return cart;
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
