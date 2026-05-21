import "server-only";

import { cache } from "react";

import { getCatalogVersion } from "./client";
import { isWixCatalogEnabled } from "./constants";
import { wixFetch } from "./wix-rest";

export interface StoreCategory {
	id: string;
	name: string;
	slug: string;
	imageUrl?: string;
	productCount?: number;
	href: string;
}

const STORES_TREE_REFERENCE = {
	appNamespace: "@wix/stores",
	treeKey: null,
};

const ALL_PRODUCTS_NAMES = new Set(["all products"]);

function isAllProductsCategory(cat: { name?: string; slug?: string }): boolean {
	const name = cat.name?.toLowerCase().trim() ?? "";
	const slug = cat.slug?.toLowerCase().trim() ?? "";
	return (
		ALL_PRODUCTS_NAMES.has(name) ||
		slug === "all-products" ||
		slug === "all_products"
	);
}

function collectionImageUrl(
	media: Record<string, unknown> | undefined
): string | undefined {
	if (!media) return undefined;
	const mainMedia = media.mainMedia as Record<string, unknown> | undefined;
	const image = mainMedia?.image as { url?: string } | undefined;
	const thumbnail = mainMedia?.thumbnail as { url?: string } | undefined;
	return image?.url ?? thumbnail?.url;
}

interface V1CollectionsResponse {
	collections?: Array<Record<string, unknown>>;
}

async function queryV1Collections(): Promise<StoreCategory[]> {
	const data = await wixFetch<V1CollectionsResponse>(
		"https://www.wixapis.com/stores/v1/collections/query",
		{
			query: { paging: { limit: 100, offset: 0 } },
			includeNumberOfProducts: true,
		}
	);

	const collections = data.collections ?? [];

	return collections
		.filter(
			(c) =>
				c.visible !== false &&
				!isAllProductsCategory({
					name: c.name as string | undefined,
					slug: c.slug as string | undefined,
				})
		)
		.map((c) => {
			const id = (c._id ?? c.id) as string;
			const slug = (c.slug as string) ?? "";
			return {
				id,
				name: (c.name as string) ?? "",
				slug,
				imageUrl: collectionImageUrl(c.media as Record<string, unknown>),
				productCount: c.numberOfProducts as number | undefined,
				href: `/shop?category=${encodeURIComponent(slug)}`,
			};
		});
}

interface V3CategoryResponse {
	categories?: Array<{
		id?: string;
		name?: string;
		slug?: string;
		itemCounter?: number;
		visible?: boolean;
		image?: { url?: string };
	}>;
}

async function queryV3Categories(): Promise<StoreCategory[]> {
	const data = await wixFetch<V3CategoryResponse>(
		"https://www.wixapis.com/categories/v1/categories/query",
		{
			treeReference: STORES_TREE_REFERENCE,
			query: { paging: { limit: 100, offset: 0 } },
			returnNonVisibleCategories: false,
		}
	);

	return (data.categories ?? [])
		.filter(
			(c) =>
				c.visible !== false &&
				!isAllProductsCategory({ name: c.name, slug: c.slug })
		)
		.map((c) => {
			const slug = c.slug ?? "";
			return {
				id: c.id ?? "",
				name: c.name ?? "",
				slug,
				imageUrl: c.image?.url,
				productCount: c.itemCounter,
				href: `/shop?category=${encodeURIComponent(slug)}`,
			};
		});
}

export const getStoreCategories = cache(async (): Promise<StoreCategory[]> => {
	if (!isWixCatalogEnabled()) return [];

	try {
		const version = await getCatalogVersion();
		if (version === "V3_CATALOG") {
			return await queryV3Categories();
		}
		return await queryV1Collections();
	} catch {
		return [];
	}
});

export async function getCategoryBySlug(
	slug: string
): Promise<StoreCategory | null> {
	const categories = await getStoreCategories();
	return categories.find((c) => c.slug === slug) ?? null;
}

export const getCategoryNameMap = cache(
	async (): Promise<Map<string, string>> => {
		const categories = await getStoreCategories();
		return new Map(categories.map((c) => [c.id, c.name]));
	}
);
