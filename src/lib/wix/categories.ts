import "server-only";

import { cache } from "react";

import { getCatalogVersion, getWixClient } from "./client";
import { isWixCatalogEnabled } from "./constants";
import { wixFetch } from "./wix-rest";

/** Wix V1 "All Products" collection — assigned to every product; skip for grouping. */
export const WIX_ALL_PRODUCTS_COLLECTION_ID =
	"00000000-000000-000000-000000000001";

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

export function isAllProductsCategory(cat: {
	id?: string;
	name?: string;
	slug?: string;
}): boolean {
	const name = cat.name?.toLowerCase().trim() ?? "";
	const slug = cat.slug?.toLowerCase().trim() ?? "";
	return (
		cat.id === WIX_ALL_PRODUCTS_COLLECTION_ID ||
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

async function queryV1CollectionsViaSdk(): Promise<StoreCategory[]> {
	const client = getWixClient();
	const results: StoreCategory[] = [];
	let offset = 0;
	const pageSize = 100;

	while (true) {
		const { items, totalCount } = await client.collections
			.queryCollections()
			.limit(pageSize)
			.skip(offset)
			.find();

		for (const c of items) {
			const id = c._id ?? "";
			const slug = c.slug ?? "";
			if (
				c.visible === false ||
				isAllProductsCategory({
					id,
					name: c.name ?? undefined,
					slug: c.slug ?? undefined,
				})
			) {
				continue;
			}
			results.push({
				id,
				name: c.name ?? "",
				slug,
				imageUrl: collectionImageUrl(
					c.media as Record<string, unknown> | undefined
				),
				productCount: c.numberOfProducts,
				href: `/shop?category=${encodeURIComponent(slug)}`,
			});
		}

		offset += items.length;
		if (items.length < pageSize) break;
		if (totalCount != null && offset >= totalCount) break;
	}

	return results;
}

/** REST fallback if SDK collections query fails. */
async function queryV1CollectionsViaRest(): Promise<StoreCategory[]> {
	const data = await wixFetch<V1CollectionsResponse>(
		"https://www.wixapis.com/stores/v1/collections/query",
		{
			query: { paging: { limit: 200, offset: 0 } },
			includeNumberOfProducts: true,
		}
	);

	return (data.collections ?? [])
		.filter(
			(c) =>
				c.visible !== false &&
				!isAllProductsCategory({
					id: (c._id ?? c.id) as string | undefined,
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
			query: { paging: { limit: 200, offset: 0 } },
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
		try {
			return await queryV1CollectionsViaSdk();
		} catch {
			return await queryV1CollectionsViaRest();
		}
	} catch {
		return [];
	}
});

export function normalizeCategoryKey(value: string): string {
	return value
		.toLowerCase()
		.trim()
		.replace(/&/g, "and")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export type CategoryLookup = {
	slug?: string;
	slugs?: string[];
	names?: string[];
	nameIncludes?: string[];
};

function pickBestCategoryMatch(
	matches: StoreCategory[]
): StoreCategory | undefined {
	if (matches.length === 0) return undefined;
	return [...matches].sort(
		(a, b) => (b.productCount ?? 0) - (a.productCount ?? 0)
	)[0];
}

/** Resolve a store category by slug and/or display name (handles duplicate names). */
export function findStoreCategory(
	categories: StoreCategory[],
	lookup: CategoryLookup
): StoreCategory | undefined {
	const slugCandidates = [lookup.slug, ...(lookup.slugs ?? [])].filter(
		Boolean
	) as string[];

	for (const candidate of slugCandidates) {
		const norm = normalizeCategoryKey(candidate);
		const match = categories.find((c) => normalizeCategoryKey(c.slug) === norm);
		if (match) return match;
	}

	if (lookup.names?.length) {
		for (const name of lookup.names) {
			const normName = name.toLowerCase().trim();
			const matches = categories.filter(
				(c) => c.name.toLowerCase().trim() === normName
			);
			const best = pickBestCategoryMatch(matches);
			if (best) return best;
		}
	}

	if (lookup.nameIncludes?.length) {
		for (const fragment of lookup.nameIncludes) {
			const lower = fragment.toLowerCase();
			const matches = categories.filter((c) =>
				c.name.toLowerCase().includes(lower)
			);
			const best = pickBestCategoryMatch(matches);
			if (best) return best;
		}
	}

	return undefined;
}

/** Legacy slug aliases used in CMS / nav before live Wix names are wired. */
const CATEGORY_SLUG_ALIASES: Record<string, CategoryLookup> = {
	children: { names: ["Children Books"], nameIncludes: ["children book"] },
	deals: { names: ["Today's Deals"], nameIncludes: ["today"] },
	"todays-deals": { names: ["Today's Deals"], nameIncludes: ["today"] },
	"best-sellers": { names: ["Best Sellers"] },
	recommended: { names: ["Islamic", "Fiction"] },
	"new-arrivals": { names: ["Teen Fiction", "Young Adults", "Comics"] },
	"new-sellers": { names: ["Teen Fiction", "Young Adults", "Comics"] },
};

export async function getCategoryBySlug(
	slug: string
): Promise<StoreCategory | null> {
	const categories = await getStoreCategories();
	const lookup = CATEGORY_SLUG_ALIASES[slug] ?? {
		slug,
		slugs: [slug],
		names: [slug.replace(/-/g, " ")],
	};
	return findStoreCategory(categories, lookup) ?? null;
}

export const getCategoryNameMap = cache(
	async (): Promise<Map<string, string>> => {
		const categories = await getStoreCategories();
		return new Map(categories.map((c) => [c.id, c.name]));
	}
);
