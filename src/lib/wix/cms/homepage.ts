import "server-only";

import type { BookProps } from "@/lib/store";

import {
	type CategoryLookup,
	findStoreCategory,
	getCategoryBySlug,
	getCategoryNameMap,
	getStoreCategories,
	WIX_ALL_PRODUCTS_COLLECTION_ID,
} from "../categories";
import { getWixClient } from "../client";
import { isWixCatalogEnabled } from "../constants";
import { resolveWixImageUrl } from "../image";
import { queryWixProducts, queryWixProductsByCategory } from "../products";
import { mapWixProductToBookProps, type WixCatalogProduct } from "../types";
import { getCmsItemData, readCmsField } from "./record";

const HOMEPAGE_SECTIONS_COLLECTION = "HomepageSections";
const HOME_BANNERS_COLLECTION = "HomeBanners";

export interface HomeBanner {
	id: string;
	title: string;
	subtitle?: string;
	ctaLabel?: string;
	ctaHref?: string;
	image: string;
}

export interface HomepageSection {
	sectionKey: string;
	title: string;
	subtitle?: string;
	badge?: BookProps["badge"];
	books: BookProps[];
}

export interface HomepageData {
	sections: HomepageSection[];
	banners: HomeBanner[];
	categories: Awaited<ReturnType<typeof getStoreCategories>>;
}

interface HomepageSectionCmsRow {
	sectionKey?: string;
	title?: string;
	subtitle?: string;
	categorySlug?: string;
	limit?: number;
	badge?: string;
	sortOrder?: number;
	enabled?: boolean;
}

function mapBadge(badge?: string): BookProps["badge"] | undefined {
	if (!badge) return undefined;
	const normalized = badge.toLowerCase().replace(/\s+/g, " ");
	if (normalized === "best seller" || normalized === "bestseller") {
		return "best seller";
	}
	if (normalized === "new seller" || normalized === "new sellers") {
		return "new seller";
	}
	if (normalized === "new arrival" || normalized === "new arrivals") {
		return "new arrival";
	}
	return undefined;
}

function productsToBooks(
	products: WixCatalogProduct[],
	categoryNameMap: Map<string, string>,
	badge?: BookProps["badge"]
): BookProps[] {
	return products
		.filter((p) => p.id || p.slug)
		.map((p) => {
			const book = mapWixProductToBookProps(p, categoryNameMap);
			return badge ? { ...book, badge } : book;
		});
}

async function resolveSectionBooks(
	row: HomepageSectionCmsRow
): Promise<BookProps[]> {
	const slug = row.categorySlug?.trim();
	if (!slug) return [];

	const category = await getCategoryBySlug(slug);
	if (!category) return [];

	const categoryNameMap = await getCategoryNameMap();
	const limit = row.limit ?? 12;
	const products = await queryWixProductsByCategory(category.id, {
		limit,
		categoryNameMap,
	});

	return productsToBooks(products, categoryNameMap, mapBadge(row.badge));
}

export async function getHomeBanners(): Promise<HomeBanner[]> {
	if (!isWixCatalogEnabled()) return [];

	try {
		const client = getWixClient();
		const { items } = await client.items
			.query(HOME_BANNERS_COLLECTION)
			.eq("enabled", true)
			.ascending("sortOrder")
			.limit(20)
			.find();

		const banners: HomeBanner[] = [];
		for (const item of items) {
			const data = getCmsItemData(item as Record<string, unknown>);
			const imageRaw = readCmsField(data, "image", "bundleImage");
			const image = resolveWixImageUrl(
				imageRaw as string | { id?: string; url?: string } | undefined,
				1600,
				900
			);
			if (!image) continue;
			banners.push({
				id: item._id ?? String(readCmsField(data, "title") ?? ""),
				title: String(readCmsField(data, "title") ?? ""),
				subtitle: readCmsField(data, "subtitle") as string | undefined,
				ctaLabel: readCmsField(data, "ctaLabel") as string | undefined,
				ctaHref: readCmsField(data, "ctaHref") as string | undefined,
				image,
			});
		}
		return banners;
	} catch {
		return [];
	}
}

export async function getHomepageSections(): Promise<HomepageSection[]> {
	if (!isWixCatalogEnabled()) return [];

	try {
		const client = getWixClient();
		const { items } = await client.items
			.query(HOMEPAGE_SECTIONS_COLLECTION)
			.eq("enabled", true)
			.ascending("sortOrder")
			.limit(20)
			.find();

		const sections: HomepageSection[] = [];

		for (const item of items) {
			const raw = getCmsItemData(item as Record<string, unknown>);
			const data = raw as HomepageSectionCmsRow;
			if (!data?.sectionKey) continue;

			const books = await resolveSectionBooks(data);
			sections.push({
				sectionKey: data.sectionKey,
				title: data.title ?? formatSectionTitle(data.sectionKey),
				subtitle: data.subtitle,
				badge: mapBadge(data.badge),
				books,
			});
		}

		return sections;
	} catch {
		return [];
	}
}

function formatSectionTitle(sectionKey: string): string {
	return sectionKey
		.split("-")
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");
}

/** Slugs verified against live Wix V1 collections API. */
const DEFAULT_HOMEPAGE_SECTION_LOOKUPS: Array<{
	sectionKey: string;
	title: string;
	subtitle?: string;
	lookup: CategoryLookup;
	badge?: BookProps["badge"];
	limit: number;
}> = [
	{
		sectionKey: "recommended",
		title: "Recommended for You",
		subtitle: "Curated picks",
		lookup: {
			slugs: ["islamic"],
			names: ["Islamic", "Fiction"],
		},
		limit: 12,
	},
	{
		sectionKey: "todays-deals",
		title: "Today's Deals",
		subtitle: "Limited Time",
		lookup: { slugs: ["todays-deals"], names: ["Today's Deals"] },
		limit: 12,
	},
	{
		sectionKey: "new-sellers",
		title: "New Arrivals",
		subtitle: "Latest for young readers",
		lookup: {
			slugs: ["teen-fiction", "young-adults"],
			names: ["Teen Fiction", "Young Adults", "Comics"],
		},
		badge: "new seller",
		limit: 12,
	},
	{
		sectionKey: "best-sellers",
		title: "Best Sellers",
		subtitle: "Top Rated",
		lookup: { slugs: ["best-sellers"], names: ["Best Sellers"] },
		badge: "best seller",
		limit: 12,
	},
	{
		sectionKey: "children",
		title: "Children's Collection",
		subtitle: "For Young Readers",
		lookup: {
			slugs: ["children-books"],
			names: ["Children Books"],
		},
		badge: "new arrival",
		limit: 12,
	},
];

async function loadSectionBooks(
	categoryId: string,
	limit: number,
	categoryNameMap: Map<string, string>,
	badge?: BookProps["badge"]
): Promise<BookProps[]> {
	const products = await queryWixProductsByCategory(categoryId, {
		limit,
		categoryNameMap,
	});
	return productsToBooks(products, categoryNameMap, badge);
}

/** Build strips by querying each known category from the live catalog. */
export async function buildHomepageSectionsFromCategories(): Promise<
	HomepageSection[]
> {
	const categories = await getStoreCategories();
	const categoryNameMap = await getCategoryNameMap();
	const sections: HomepageSection[] = [];

	for (const def of DEFAULT_HOMEPAGE_SECTION_LOOKUPS) {
		const match = findStoreCategory(categories, def.lookup);
		const books = match
			? await loadSectionBooks(match.id, def.limit, categoryNameMap, def.badge)
			: [];

		sections.push({
			sectionKey: def.sectionKey,
			title: def.title,
			subtitle: def.subtitle,
			badge: def.badge,
			books,
		});
	}

	return sections;
}

/**
 * Fallback: fetch store products, group by collection id on each product
 * (excluding "All Products"), and build strips from categories that appear.
 */
export async function buildHomepageSectionsFromProducts(): Promise<
	HomepageSection[]
> {
	const categories = await getStoreCategories();
	const categoryNameMap = await getCategoryNameMap();
	const products = await queryWixProducts({ limit: 200 });

	const booksByCategoryId = new Map<string, BookProps[]>();

	for (const product of products) {
		const collectionIds = (
			product.categoryIds ??
			product.collectionIds ??
			[]
		).filter((id) => id && id !== WIX_ALL_PRODUCTS_COLLECTION_ID);

		const primaryId =
			product.primaryCategoryId ??
			collectionIds.find((id) => categoryNameMap.has(id)) ??
			collectionIds[0];

		if (!primaryId) continue;

		const list = booksByCategoryId.get(primaryId) ?? [];
		if (list.length >= 12) continue;

		const book = mapWixProductToBookProps(product, categoryNameMap);
		list.push(book);
		booksByCategoryId.set(primaryId, list);
	}

	const preferredOrder = [
		"islamic",
		"todays-deals",
		"best-sellers",
		"children-books",
		"fiction",
		"teen-fiction",
	];

	const ranked = categories
		.filter((c) => booksByCategoryId.has(c.id))
		.sort((a, b) => {
			const ai = preferredOrder.indexOf(a.slug);
			const bi = preferredOrder.indexOf(b.slug);
			if (ai !== -1 || bi !== -1) {
				return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
			}
			return (b.productCount ?? 0) - (a.productCount ?? 0);
		})
		.slice(0, 5);

	if (ranked.length === 0) {
		const any = [...booksByCategoryId.entries()].slice(0, 5);
		return any.map(([categoryId, books]) => ({
			sectionKey: categoryId,
			title: categoryNameMap.get(categoryId) ?? "Featured",
			books,
		}));
	}

	return ranked.map((cat) => ({
		sectionKey: cat.slug || cat.id,
		title: cat.name,
		subtitle: cat.productCount ? `${cat.productCount} titles` : undefined,
		books: booksByCategoryId.get(cat.id) ?? [],
	}));
}

function sectionsHaveBooks(sections: HomepageSection[]): boolean {
	return sections.some((s) => s.books.length > 0);
}

export async function getHomepageData(): Promise<HomepageData> {
	const [cmsSections, banners, categories] = await Promise.all([
		getHomepageSections(),
		getHomeBanners(),
		getStoreCategories(),
	]);

	let sections = cmsSections;

	if (!sectionsHaveBooks(sections)) {
		sections = await buildHomepageSectionsFromCategories();
	}

	if (!sectionsHaveBooks(sections)) {
		sections = await buildHomepageSectionsFromProducts();
	}

	return { sections, banners, categories };
}
