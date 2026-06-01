"use server";

import { revalidatePath } from "next/cache";

import { getVisitorWixClient } from "@/lib/wix/client";

export async function addToCartAction(input: {
	checkoutCatalogItemId: string;
	checkoutCatalogAppId?: string;
	bundleSlug?: string;
	quantity?: number;
}) {
	const catalogItemId = input.checkoutCatalogItemId?.trim();

	console.log("[bundle-cart] addToCartAction (server)", {
		checkoutCatalogItemId: catalogItemId || "(empty)",
		checkoutCatalogAppId: input.checkoutCatalogAppId ?? "(none)",
		bundleSlug: input.bundleSlug?.trim() || "(none)",
		quantity: input.quantity ?? 1,
	});

	if (!catalogItemId && !input.bundleSlug?.trim()) {
		console.warn(
			"[bundle-cart] addToCartAction rejected — no catalog id or slug"
		);
		throw new Error("Bundle has no checkout catalog item id.");
	}

	try {
		const wixClient = await getVisitorWixClient();
		const updatedCart = await wixClient.currentCart.addToCurrentCart({
			lineItems: [
				{
					catalogReference: {
						appId: "e593b0bd-b783-45b8-97c2-873d42aacaf4", // CMS catalog
						catalogItemId: input.checkoutCatalogItemId, // CMS item _id
					},
					quantity: 1,
				},
			],
		});

		console.log("[bundle-cart] addToCartAction updatedCart", updatedCart);

		revalidatePath("/", "layout");
		// sanity check: fetch again
		const current = await wixClient.currentCart.getCurrentCart();
		console.log("[bundle-cart] getCurrentCart after add", current);

		return { cart: current };
	} catch (error) {
		console.error("[bundle-cart] addToCartAction failed:", error);
		throw error;
	}
}
