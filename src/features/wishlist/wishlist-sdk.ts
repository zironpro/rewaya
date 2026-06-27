import type { BookProps } from "@/lib/store";
import type { createBrowserClient } from "@/lib/wix/browser-client";

type WixBrowserClient = NonNullable<ReturnType<typeof createBrowserClient>>;

import { WISHLIST_COLLECTION } from "@/lib/wix/constants";
import {
	mapWixProductToBookProps,
	type WixCatalogProduct,
} from "@/lib/wix/types";

export const WISHLIST_CACHE_KEY = "wishlist:product-ids";

export function readLocalWishlistIds(): string[] {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(WISHLIST_CACHE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed)
			? parsed.filter((id): id is string => typeof id === "string")
			: [];
	} catch {
		return [];
	}
}

export function writeLocalWishlistIds(ids: string[]): void {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(WISHLIST_CACHE_KEY, JSON.stringify(ids));
	} catch {
		/* storage full / denied */
	}
}

function uniqueIds(ids: string[]): string[] {
	return [...new Set(ids.filter(Boolean))];
}

export function mergeWishlistIds(local: string[], remote: string[]): string[] {
	return uniqueIds([...remote, ...local]);
}

type WishlistRow = {
	_id?: string;
	data?: { memberId?: string; productId?: string };
};

export async function fetchMemberWishlistIds(
	client: WixBrowserClient,
	memberId: string
): Promise<string[]> {
	try {
		const result = await client.items
			.query(WISHLIST_COLLECTION)
			.eq("memberId", memberId)
			.limit(100)
			.find();

		return uniqueIds(
			(result.items as WishlistRow[])
				.map((item) => item.data?.productId)
				.filter((id): id is string => Boolean(id))
		);
	} catch {
		return [];
	}
}

export async function addToMemberWishlist(
	client: WixBrowserClient,
	memberId: string,
	productId: string
): Promise<void> {
	const existing = await client.items
		.query(WISHLIST_COLLECTION)
		.eq("memberId", memberId)
		.eq("productId", productId)
		.limit(1)
		.find();

	if (existing.items.length > 0) return;

	await client.items.insert(WISHLIST_COLLECTION, {
		memberId,
		productId,
	});
}

export async function removeFromMemberWishlist(
	client: WixBrowserClient,
	memberId: string,
	productId: string
): Promise<void> {
	const result = await client.items
		.query(WISHLIST_COLLECTION)
		.eq("memberId", memberId)
		.eq("productId", productId)
		.limit(1)
		.find();

	const row = result.items[0] as WishlistRow | undefined;
	if (row?._id) {
		await client.items.remove(WISHLIST_COLLECTION, row._id);
	}
}

export async function mergeGuestWishlistOnLogin(
	client: WixBrowserClient,
	memberId: string
): Promise<string[]> {
	const localIds = readLocalWishlistIds();
	const remoteIds = await fetchMemberWishlistIds(client, memberId);

	for (const productId of localIds) {
		if (!remoteIds.includes(productId)) {
			try {
				await addToMemberWishlist(client, memberId, productId);
			} catch {
				/* collection may not exist yet */
			}
			remoteIds.push(productId);
		}
	}

	const merged = uniqueIds(remoteIds);
	writeLocalWishlistIds(merged);
	return merged;
}

export async function fetchWishlistProducts(
	client: WixBrowserClient,
	ids: string[]
): Promise<BookProps[]> {
	if (!ids.length) return [];

	try {
		const { items } = await client.productsV3
			.queryProducts({
				fields: ["URL", "DESCRIPTION", "INFO_SECTION", "ALL_CATEGORIES_INFO"],
			})
			.in("_id", ids)
			.limit(ids.length)
			.find();

		return items.map((p) =>
			mapWixProductToBookProps(p as unknown as WixCatalogProduct)
		);
	} catch {
		try {
			const { items } = await client.products
				.queryProducts()
				.in("_id", ids)
				.limit(ids.length)
				.find();

			return items.map((p) => {
				const raw = p as {
					_id?: string;
					id?: string;
					name?: string;
					slug?: string;
					price?: { price?: number };
					media?: { mainMedia?: { image?: { url?: string } } };
				};
				const wixId = raw._id ?? raw.id ?? "";
				return mapWixProductToBookProps({
					id: wixId,
					name: raw.name ?? "",
					slug: raw.slug ?? wixId,
					price: raw.price?.price,
					imageUrl: raw.media?.mainMedia?.image?.url,
				});
			});
		} catch {
			return [];
		}
	}
}
