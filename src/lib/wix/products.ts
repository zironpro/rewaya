import "server-only";

import { allBooks as staticBooks } from "@/features/products/data/products";
import { bundles as staticBundles } from "@/lib/bundles-data";
import type { BookProps } from "@/lib/store";

import {
	getCategoryBySlug,
	getCategoryNameMap,
	getStoreCategories,
} from "./categories";
import { getCatalogVersion, getWixClient } from "./client";
import { isWixCatalogEnabled } from "./constants";
import {
	mapWixProductToBook,
	mapWixProductToBookProps,
	type WixCatalogProduct,
} from "./types";
import { wixFetch } from "./wix-rest";

const DEFAULT_LIMIT = 100;
const STORES_TREE_REFERENCE = {
	appNamespace: "@wix/stores",
	treeKey: null,
};

// biome-ignore lint/suspicious/noExplicitAny: Wix SDK typings omit expanded product fields present at runtime.
type V1Product = Record<string, any>;

export interface QueryWixProductsOptions {
	limit?: number;
	offset?: number;
	slugs?: string[];
	ids?: string[];
	collectionId?: string;
	categoryId?: string;
	search?: string;
	categoryNameMap?: Map<string, string>;
}

function getInfoSection(product: V1Product, title: string): string | undefined {
	const sections = product.additionalInfoSections as
		| Array<{ title?: string; description?: string }>
		| undefined;
	return sections?.find((s) => s.title === title)?.description;
}

function resolveCategoryNames(
	product: {
		collectionIds?: string[];
		categoryIds?: string[];
		categoryNames?: string[];
		genre?: string;
	},
	categoryNameMap?: Map<string, string>
): {
	categoryNames?: string[];
	primaryCategoryId?: string;
	primaryCategorySlug?: string;
} {
	const ids = product.categoryIds ?? product.collectionIds ?? [];
	const namesFromIds = ids
		.map((id) => categoryNameMap?.get(id))
		.filter((name): name is string => Boolean(name));

	const categoryNames = product.categoryNames?.length
		? product.categoryNames
		: namesFromIds.length
			? namesFromIds
			: product.genre
				? [product.genre]
				: undefined;

	return {
		categoryNames,
		primaryCategoryId: ids[0],
	};
}

function mapV1Product(
	product: V1Product,
	categoryNameMap?: Map<string, string>
): WixCatalogProduct {
	const priceData = product.priceData ?? product.price;
	const mainImage =
		product.media?.mainMedia?.image?.url ??
		product.media?.mainMedia?.thumbnail?.url;
	const collectionIds = (product.collectionIds ?? []) as string[];
	const { categoryNames, primaryCategoryId } = resolveCategoryNames(
		{ collectionIds, genre: product.ribbon as string | undefined },
		categoryNameMap
	);

	return {
		id: product.id as string,
		name: product.name as string,
		slug: product.slug as string,
		description: product.description as string | undefined,
		sku: product.sku as string | undefined,
		visible: product.visible as boolean | undefined,
		price: priceData?.price as number | undefined,
		formattedPrice: priceData?.formatted?.price as string | undefined,
		currency: priceData?.currency as string | undefined,
		imageUrl: mainImage as string | undefined,
		author: getInfoSection(product, "Author"),
		publisher: getInfoSection(product, "Publisher"),
		language: getInfoSection(product, "Language"),
		genre: product.ribbon as string | undefined,
		collectionIds,
		categoryIds: collectionIds,
		categoryNames,
		primaryCategoryId,
		productPagePath: (product.productPageUrl as { path?: string } | undefined)
			?.path,
	};
}

function mapV3Product(
	product: Record<string, unknown>,
	categoryNameMap?: Map<string, string>
): WixCatalogProduct {
	const variantsInfo = product.variantsInfo as
		| { variants?: Array<Record<string, unknown>> }
		| undefined;
	const variant = variantsInfo?.variants?.[0];
	const priceData = variant?.price as
		| { actualPrice?: { amount?: string | number } }
		| undefined;
	const price = priceData?.actualPrice?.amount;
	const media = product.media as
		| { main?: { image?: { url?: string }; thumbnail?: { url?: string } } }
		| undefined;
	const image = media?.main?.image?.url ?? media?.main?.thumbnail?.url;

	const allCategories = product.allCategoriesInfo as
		| { categories?: Array<{ id?: string; name?: string; slug?: string }> }
		| undefined;
	const directCategories = product.directCategoriesInfo as
		| { categories?: Array<{ id?: string; name?: string; slug?: string }> }
		| undefined;
	const categories =
		directCategories?.categories ?? allCategories?.categories ?? [];

	const categoryIds = categories
		.map((c) => c.id)
		.filter((id): id is string => Boolean(id));
	const categoryNames = categories
		.map((c) => c.name)
		.filter((name): name is string => Boolean(name));
	const categorySlugs = categories
		.map((c) => c.slug)
		.filter((slug): slug is string => Boolean(slug));

	const infoSections = product.infoSections as
		| Array<{ title?: string; plainDescription?: string; description?: string }>
		| undefined;
	const getSection = (title: string) =>
		infoSections?.find((s) => s.title === title)?.plainDescription ??
		infoSections?.find((s) => s.title === title)?.description;

	const resolved = resolveCategoryNames(
		{ categoryIds, categoryNames, genre: undefined },
		categoryNameMap
	);

	return {
		id: product.id as string,
		name: product.name as string,
		slug: product.slug as string,
		description: product.description as string | undefined,
		sku: variant?.sku as string | undefined,
		visible: product.visible as boolean | undefined,
		price: price != null ? Number(price) : undefined,
		imageUrl: image as string | undefined,
		author: getSection("Author"),
		publisher: getSection("Publisher"),
		language: getSection("Language"),
		categoryIds,
		categoryNames: resolved.categoryNames ?? categoryNames,
		primaryCategoryId: categoryIds[0],
		primaryCategorySlug: categorySlugs[0],
		productPagePath: (product.productPageUrl as { path?: string } | undefined)
			?.path,
	};
}

async function listV3CategoryProductIds(
	categoryId: string,
	limit: number
): Promise<string[]> {
	const data = await wixFetch<{
		catalogItems?: Array<{ catalogItemId?: string }>;
	}>(
		`https://www.wixapis.com/categories/v1/categories/${categoryId}/list-items`,
		{
			treeReference: STORES_TREE_REFERENCE,
			paging: { limit, offset: 0 },
		}
	);

	return (data.catalogItems ?? [])
		.map((item) => item.catalogItemId)
		.filter((id): id is string => Boolean(id));
}

async function queryV1ProductsViaSdk(options: {
	limit: number;
	offset: number;
	collectionId?: string;
	search?: string;
	slugs?: string[];
	ids?: string[];
}): Promise<V1Product[]> {
	const client = getWixClient();
	let query = client.products.queryProducts();

	if (options.collectionId) {
		query = query.hasSome("collectionIds", [options.collectionId]);
	}
	if (options.search?.trim()) {
		query = query.startsWith("name", options.search.trim());
	}
	if (options.slugs?.length === 1) {
		query = query.eq("slug", options.slugs[0]);
	} else if (options.ids?.length) {
		query = query.in("_id", options.ids);
	}

	const { items } = await query
		.limit(options.limit)
		.skip(options.offset)
		.find();
	return items as V1Product[];
}

export async function searchWixProducts(options: {
	query: string;
	limit?: number;
	offset?: number;
	categoryNameMap?: Map<string, string>;
}): Promise<WixCatalogProduct[]> {
	if (!isWixCatalogEnabled() || !options.query.trim()) return [];

	const client = getWixClient();
	const version = await getCatalogVersion();
	const limit = options.limit ?? DEFAULT_LIMIT;
	const offset = options.offset ?? 0;
	const categoryNameMap =
		options.categoryNameMap ?? (await getCategoryNameMap());

	if (version === "V3_CATALOG") {
		const { products: items = [] } = await client.productsV3.searchProducts({
			search: { expression: options.query.trim() },
		});

		return (items as Array<Record<string, unknown>>)
			.slice(offset, offset + limit)
			.map((p) => mapV3Product(p, categoryNameMap));
	}

	const products = await queryV1ProductsViaSdk({
		limit,
		offset,
		search: options.query,
	});
	return products
		.map((p) => mapV1Product(p, categoryNameMap))
		.filter((product) => product.visible !== false);
}

export async function queryWixProductsByCategory(
	categoryId: string,
	options?: {
		limit?: number;
		offset?: number;
		categoryNameMap?: Map<string, string>;
	}
): Promise<WixCatalogProduct[]> {
	if (!isWixCatalogEnabled()) return [];

	const version = await getCatalogVersion();
	const limit = options?.limit ?? DEFAULT_LIMIT;
	const offset = options?.offset ?? 0;
	const categoryNameMap =
		options?.categoryNameMap ?? (await getCategoryNameMap());

	if (version === "V3_CATALOG") {
		const productIds = await listV3CategoryProductIds(
			categoryId,
			limit + offset
		);
		const ids = productIds.slice(offset, offset + limit);
		if (ids.length === 0) return [];
		return queryWixProducts({ ids, limit: ids.length, categoryNameMap });
	}

	const products = await queryV1ProductsViaSdk({
		limit,
		offset,
		collectionId: categoryId,
	});
	return products
		.map((p) => mapV1Product(p, categoryNameMap))
		.filter((product) => product.visible !== false);
}

export async function queryWixProducts(
	options?: QueryWixProductsOptions
): Promise<WixCatalogProduct[]> {
	if (!isWixCatalogEnabled()) return [];

	const categoryNameMap =
		options?.categoryNameMap ?? (await getCategoryNameMap());

	if (options?.search?.trim()) {
		return searchWixProducts({
			query: options.search,
			limit: options.limit,
			offset: options.offset,
			categoryNameMap,
		});
	}

	const categoryId = options?.categoryId ?? options?.collectionId;
	if (categoryId) {
		return queryWixProductsByCategory(categoryId, {
			limit: options?.limit,
			offset: options?.offset,
			categoryNameMap,
		});
	}

	const client = getWixClient();
	const version = await getCatalogVersion();
	const limit = options?.limit ?? DEFAULT_LIMIT;
	const offset = options?.offset ?? 0;

	if (version === "V3_CATALOG") {
		let query = client.productsV3.queryProducts({
			fields: ["URL", "DESCRIPTION", "INFO_SECTION", "ALL_CATEGORIES_INFO"],
		});

		if (options?.ids?.length) {
			query = query.in("_id", options.ids);
		}

		const { items } = await query.limit(limit).skipTo(String(offset)).find();
		return items.map((p) =>
			mapV3Product(p as Record<string, unknown>, categoryNameMap)
		);
	}

	const products = await queryV1ProductsViaSdk({
		limit,
		offset,
		slugs: options?.slugs,
		ids: options?.ids,
	});
	return products
		.map((p) => mapV1Product(p, categoryNameMap))
		.filter((product) => product.visible !== false);
}

export async function getWixProductBySlug(
	slug: string
): Promise<WixCatalogProduct | null> {
	const categoryNameMap = await getCategoryNameMap();
	const products = await queryWixProducts({
		slugs: [slug],
		limit: 1,
		categoryNameMap,
	});
	return products[0] ?? null;
}

export async function getWixProductById(
	id: string
): Promise<WixCatalogProduct | null> {
	const categoryNameMap = await getCategoryNameMap();
	const products = await queryWixProducts({
		ids: [id],
		limit: 1,
		categoryNameMap,
	});
	return products[0] ?? null;
}

export interface GetShopBooksOptions {
	search?: string;
	categorySlug?: string;
	limit?: number;
	offset?: number;
}

export async function getShopBooks(options?: GetShopBooksOptions) {
	if (!isWixCatalogEnabled()) {
		return filterStaticBooks(staticBooks, options);
	}

	try {
		const categoryNameMap = await getCategoryNameMap();
		let products: WixCatalogProduct[];

		if (options?.search?.trim()) {
			products = await searchWixProducts({
				query: options.search,
				limit: options?.limit ?? DEFAULT_LIMIT,
				offset: options?.offset,
				categoryNameMap,
			});
		} else if (options?.categorySlug) {
			const category = await getCategoryBySlug(options.categorySlug);
			if (!category) {
				products = [];
			} else {
				products = await queryWixProductsByCategory(category.id, {
					limit: options?.limit ?? DEFAULT_LIMIT,
					offset: options?.offset,
					categoryNameMap,
				});
			}
		} else {
			products = await queryWixProducts({
				limit: options?.limit ?? DEFAULT_LIMIT,
				offset: options?.offset,
				categoryNameMap,
			});
		}

		return products.map((p) => mapWixProductToBookProps(p, categoryNameMap));
	} catch {
		return filterStaticBooks(staticBooks, options);
	}
}

function filterStaticBooks(
	books: typeof staticBooks,
	options?: GetShopBooksOptions
) {
	let result = books;

	if (options?.categorySlug) {
		result = result.filter(
			(b) => b.category.toLowerCase() === options.categorySlug?.toLowerCase()
		);
	}

	if (options?.search?.trim()) {
		const q = options.search.trim().toLowerCase();
		result = result.filter((b) => {
			const book = b as BookProps;
			return (
				book.title.toLowerCase().includes(q) ||
				book.author?.toLowerCase().includes(q) ||
				book.category.toLowerCase().includes(q)
			);
		});
	}

	return result;
}

export interface RelatedShopBooksOptions {
	wixProductId?: string;
	slug?: string;
	categoryId?: string;
	categorySlug?: string;
	category?: string;
	id?: number;
	limit?: number;
}

function matchesCategory(
	book: BookProps,
	categoryName: string,
	categoryId?: string
): boolean {
	if (categoryId && book.categoryId === categoryId) return true;
	return book.category.toLowerCase() === categoryName.toLowerCase();
}

async function resolveRelatedCategoryId(
	product: RelatedShopBooksOptions
): Promise<{ categoryId: string; categoryName: string; categorySlug?: string } | null> {
	if (product.categoryId && product.category) {
		return {
			categoryId: product.categoryId,
			categoryName: product.category,
			categorySlug: product.categorySlug,
		};
	}

	if (product.categorySlug) {
		const category = await getCategoryBySlug(product.categorySlug);
		if (category) {
			return {
				categoryId: category.id,
				categoryName: product.category ?? category.name,
				categorySlug: category.slug,
			};
		}
	}

	if (product.categoryId) {
		const categoryNameMap = await getCategoryNameMap();
		const categoryName = categoryNameMap.get(product.categoryId);
		if (categoryName) {
			return {
				categoryId: product.categoryId,
				categoryName: product.category ?? categoryName,
				categorySlug: product.categorySlug,
			};
		}
	}

	if (product.category) {
		const categories = await getStoreCategories();
		const match = categories.find(
			(c) => c.name.toLowerCase() === product.category?.toLowerCase()
		);
		if (match) {
			return {
				categoryId: match.id,
				categoryName: match.name,
				categorySlug: match.slug,
			};
		}
	}

	return null;
}

function resolveStaticCategory(product: RelatedShopBooksOptions): string | undefined {
	if (product.category) return product.category;
	if (product.id == null || isWixCatalogEnabled()) return undefined;
	return staticBooks.find((b) => b.id === product.id)?.category;
}

function isCurrentProduct(
	book: BookProps,
	product: RelatedShopBooksOptions
): boolean {
	if (product.wixProductId && book.wixProductId === product.wixProductId) {
		return true;
	}
	if (product.slug && book.slug === product.slug) return true;
	if (product.id != null && book.id === product.id) return true;
	return false;
}

function takeBooks(
	books: BookProps[],
	product: RelatedShopBooksOptions,
	limit: number,
	exclude?: BookProps[]
): BookProps[] {
	const excludedKeys = new Set(
		(exclude ?? []).map(
			(book) => book.wixProductId ?? book.slug ?? String(book.id)
		)
	);

	return books
		.filter((book) => {
			if (isCurrentProduct(book, product)) return false;
			const key = book.wixProductId ?? book.slug ?? String(book.id);
			if (excludedKeys.has(key)) return false;
			return true;
		})
		.slice(0, limit);
}

export async function getSameCategoryShopBooks(
	product: RelatedShopBooksOptions
): Promise<BookProps[]> {
	const limit = product.limit ?? 4;
	const category = resolveStaticCategory(product);

	if (!category && !product.categoryId && !product.categorySlug) {
		return [];
	}

	if (!isWixCatalogEnabled()) {
		if (!category) return [];
		const books = filterStaticBooks(staticBooks, undefined).filter((b) =>
			matchesCategory(b, category, product.categoryId)
		);
		return takeBooks(books, product, limit);
	}

	try {
		const resolved = await resolveRelatedCategoryId({
			...product,
			category,
		});
		if (!resolved) return [];

		const categoryNameMap = await getCategoryNameMap();
		const products = await queryWixProductsByCategory(resolved.categoryId, {
			limit: limit + 1,
			categoryNameMap,
		});

		const books = products
			.map((p) => mapWixProductToBookProps(p, categoryNameMap))
			.filter((book) =>
				matchesCategory(book, resolved.categoryName, resolved.categoryId)
			);

		return takeBooks(books, product, limit);
	} catch {
		if (!category) return [];
		const books = filterStaticBooks(staticBooks, undefined).filter((b) =>
			matchesCategory(b, category, product.categoryId)
		);
		return takeBooks(books, product, limit);
	}
}

export async function getRelatedReadsShopBooks(
	product: RelatedShopBooksOptions & { excludeBooks?: BookProps[] }
): Promise<BookProps[]> {
	const limit = product.limit ?? 4;
	const category = resolveStaticCategory(product);

	if (!isWixCatalogEnabled()) {
		const books = filterStaticBooks(staticBooks, undefined).filter((b) => {
			if (!category) return true;
			return !matchesCategory(b, category, product.categoryId);
		});
		return takeBooks(books, product, limit, product.excludeBooks);
	}

	try {
		const categoryNameMap = await getCategoryNameMap();
		const fetchLimit = limit + (product.excludeBooks?.length ?? 0) + 5;

		const products = await queryWixProducts({
			limit: fetchLimit,
			categoryNameMap,
		});

		const books = products
			.map((p) => mapWixProductToBookProps(p, categoryNameMap))
			.filter((book) => {
				if (!category) return true;
				return !matchesCategory(book, category, product.categoryId);
			});

		return takeBooks(books, product, limit, product.excludeBooks);
	} catch {
		const books = filterStaticBooks(staticBooks, undefined).filter((b) => {
			if (!category) return true;
			return !matchesCategory(b, category, product.categoryId);
		});
		return takeBooks(books, product, limit, product.excludeBooks);
	}
}

export async function getProductBookSections(product: RelatedShopBooksOptions) {
	const sameCategory = await getSameCategoryShopBooks(product);
	const relatedReads = await getRelatedReadsShopBooks({
		...product,
		excludeBooks: sameCategory,
	});

	return { sameCategory, relatedReads };
}

/** @deprecated Use getSameCategoryShopBooks or getProductBookSections */
export const getRelatedShopBooks = getSameCategoryShopBooks;

export async function getBookProductsForBundles() {
	if (!isWixCatalogEnabled()) {
		return staticBundles.flatMap((b) => b.books);
	}

	try {
		const categoryNameMap = await getCategoryNameMap();
		const products = await queryWixProducts({
			limit: DEFAULT_LIMIT,
			categoryNameMap,
		});
		return products.map(mapWixProductToBook);
	} catch {
		return staticBundles.flatMap((b) => b.books);
	}
}
