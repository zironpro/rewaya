import "server-only";

import type { ProductDetailData } from "@/features/products/types";
import type { BookProps } from "@/lib/store";

import type { CatalogProduct } from "./catalog-types";
import {
	getCategoryBySlug,
	getCategoryNameMap,
	getStoreCategories,
	WIX_ALL_PRODUCTS_COLLECTION_ID,
} from "./categories";
import { getCatalogVersion, getWixClient } from "./client";
import { isWixCatalogEnabled } from "./constants";
import {
	buildProductDetails,
	getInfoSectionValue,
	parseV1AdditionalInfoSections,
	parseV3InfoSections,
} from "./info-sections";
import {
	catalogProductToBookProps,
	reshapeV1Product,
	reshapeV3FromCatalog,
} from "./reshape-product";
import {
	mapWixProductToBook,
	mapWixProductToBookProps,
	type WixCatalogProduct,
} from "./types";
import { wixFetch } from "./wix-rest";

const DEFAULT_LIMIT = 100;
const MAX_WIX_LIMIT = 100;
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
	minPrice?: number;
	maxPrice?: number;
}

function resolveWixProductId(product: Record<string, unknown>): string {
	const raw = product.id ?? product._id;
	return raw != null ? String(raw) : "";
}

function filterCatalogProducts(
	products: WixCatalogProduct[]
): WixCatalogProduct[] {
	return products.filter(
		(product) => Boolean(product.id) && product.visible !== false
	);
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
	const collectionIds = (product.collectionIds ?? []).filter(
		(id: string) => id !== WIX_ALL_PRODUCTS_COLLECTION_ID
	) as string[];
	const { categoryNames, primaryCategoryId } = resolveCategoryNames(
		{ collectionIds, genre: product.ribbon as string | undefined },
		categoryNameMap
	);
	const primaryCollectionId =
		collectionIds.find((id) => categoryNameMap?.has(id)) ??
		primaryCategoryId ??
		collectionIds[0];
	const infoSections = parseV1AdditionalInfoSections(product);

	return {
		id: resolveWixProductId(product),
		name: product.name as string,
		slug: product.slug as string,
		description: product.description as string | undefined,
		sku: product.sku as string | undefined,
		visible: product.visible as boolean | undefined,
		price: priceData?.price as number | undefined,
		formattedPrice: priceData?.formatted?.price as string | undefined,
		currency: priceData?.currency as string | undefined,
		imageUrl: mainImage as string | undefined,
		author: getInfoSectionValue(infoSections, "Author"),
		publisher: getInfoSectionValue(infoSections, "Publisher"),
		language: getInfoSectionValue(infoSections, "Language"),
		infoSections,
		genre: product.ribbon as string | undefined,
		collectionIds,
		categoryIds: collectionIds,
		categoryNames,
		primaryCategoryId: primaryCollectionId,
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

	const infoSections = parseV3InfoSections(product);

	const variantInventory = variant?.inventoryStatus as
		| { inStock?: boolean; preorderEnabled?: boolean }
		| undefined;
	const productStock = product.stock as
		| { inventoryStatus?: string }
		| undefined;

	const resolved = resolveCategoryNames(
		{ categoryIds, categoryNames, genre: undefined },
		categoryNameMap
	);

	return {
		id: resolveWixProductId(product),
		name: product.name as string,
		slug: product.slug as string,
		description: product.description as string | undefined,
		sku: variant?.sku as string | undefined,
		visible: product.visible as boolean | undefined,
		price: price != null ? Number(price) : undefined,
		imageUrl: image as string | undefined,
		author: getInfoSectionValue(infoSections, "Author"),
		publisher: getInfoSectionValue(infoSections, "Publisher"),
		language: getInfoSectionValue(infoSections, "Language"),
		infoSections,
		categoryIds,
		categoryNames: resolved.categoryNames ?? categoryNames,
		primaryCategoryId: categoryIds[0],
		primaryCategorySlug: categorySlugs[0],
		productPagePath: (product.productPageUrl as { path?: string } | undefined)
			?.path,
		variantId: (variant?.id ?? variant?._id) as string | undefined,
		inventoryStatus: productStock?.inventoryStatus,
		variantInStock: variantInventory?.inStock,
		variantPreorderEnabled: variantInventory?.preorderEnabled,
	};
}

async function listV3CategoryProductIds(
	categoryId: string,
	limit: number
): Promise<string[]> {
	const target = Math.max(0, limit);
	const ids: string[] = [];
	let offset = 0;

	while (ids.length < target) {
		const pageLimit = Math.min(MAX_WIX_LIMIT, target - ids.length);
		if (pageLimit <= 0) break;

		const data = await wixFetch<{
			catalogItems?: Array<{ catalogItemId?: string }>;
		}>(
			`https://www.wixapis.com/categories/v1/categories/${categoryId}/list-items`,
			{
				treeReference: STORES_TREE_REFERENCE,
				paging: { limit: pageLimit, offset },
			}
		);

		const batch = (data.catalogItems ?? [])
			.map((item) => item.catalogItemId)
			.filter((id): id is string => Boolean(id));

		ids.push(...batch);
		if (batch.length < pageLimit) break;
		offset += batch.length;
	}

	return ids;
}

async function queryV1ProductsViaSdk(options: {
	limit: number;
	offset: number;
	collectionId?: string;
	search?: string;
	slugs?: string[];
	ids?: string[];
	minPrice?: number;
	maxPrice?: number;
}): Promise<{ items: V1Product[]; totalCount: number }> {
	const client = getWixClient();
	const limit = Math.min(Math.max(1, options.limit), MAX_WIX_LIMIT);
	const offset = Math.max(0, options.offset);
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
	if (options.minPrice !== undefined) {
		query = query.ge("price", options.minPrice);
	}
	if (options.maxPrice !== undefined) {
		query = query.le("price", options.maxPrice);
	}

	const { items, totalCount } = await query.limit(limit).skip(offset).find();
	return { items: items as V1Product[], totalCount: totalCount ?? 0 };
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
	const limit = Math.min(
		Math.max(1, options.limit ?? DEFAULT_LIMIT),
		MAX_WIX_LIMIT
	);
	const offset = Math.max(0, options.offset ?? 0);
	const categoryNameMap =
		options.categoryNameMap ?? (await getCategoryNameMap());

	if (version === "V3_CATALOG") {
		const { products: items = [] } = await client.productsV3.searchProducts({
			search: { expression: options.query.trim() },
		});

		return filterCatalogProducts(
			(items as Array<Record<string, unknown>>)
				.slice(offset, offset + limit)
				.map((p) => mapV3Product(p, categoryNameMap))
		);
	}

	const { items } = await queryV1ProductsViaSdk({
		limit,
		offset,
		search: options.query,
	});
	return filterCatalogProducts(
		items.map((p) => mapV1Product(p, categoryNameMap))
	);
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
	const limit = Math.min(
		Math.max(1, options?.limit ?? DEFAULT_LIMIT),
		MAX_WIX_LIMIT
	);
	const offset = Math.max(0, options?.offset ?? 0);
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

	const { items } = await queryV1ProductsViaSdk({
		limit,
		offset,
		collectionId: categoryId,
	});
	return filterCatalogProducts(
		items.map((p) => mapV1Product(p, categoryNameMap))
	);
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
	const limit = Math.min(
		Math.max(1, options?.limit ?? DEFAULT_LIMIT),
		MAX_WIX_LIMIT
	);
	const offset = Math.max(0, options?.offset ?? 0);

	if (version === "V3_CATALOG") {
		let query = client.productsV3.queryProducts({
			fields: ["URL", "DESCRIPTION", "INFO_SECTION", "ALL_CATEGORIES_INFO"],
		});

		if (options?.ids?.length) {
			query = query.in("_id", options.ids);
		} else if (options?.slugs?.length === 1) {
			query = query.eq("slug", options.slugs[0]);
		}
		if (options?.minPrice !== undefined) {
			// Try to filter V3 by price
			query = query.ge("price.price", options.minPrice);
		}
		if (options?.maxPrice !== undefined) {
			query = query.le("price.price", options.maxPrice);
		}

		const { items } = await query.limit(limit).skipTo(String(offset)).find();
		return filterCatalogProducts(
			items.map((p) =>
				mapV3Product(p as Record<string, unknown>, categoryNameMap)
			)
		);
	}

	const { items } = await queryV1ProductsViaSdk({
		limit,
		offset,
		slugs: options?.slugs,
		ids: options?.ids,
		minPrice: options?.minPrice,
		maxPrice: options?.maxPrice,
	});
	return filterCatalogProducts(
		items.map((p) => mapV1Product(p, categoryNameMap))
	);
}

export async function getWixProductBySlug(
	slug: string
): Promise<WixCatalogProduct | null> {
	try {
		const categoryNameMap = await getCategoryNameMap();
		const products = await queryWixProducts({
			slugs: [slug],
			limit: 1,
			categoryNameMap,
		});
		return products[0] ?? null;
	} catch {
		return null;
	}
}

export async function getCatalogProductBySlug(
	slug: string
): Promise<CatalogProduct | null> {
	if (!isWixCatalogEnabled()) return null;

	try {
		const categoryNameMap = await getCategoryNameMap();
		const version = await getCatalogVersion();

		if (version === "V3_CATALOG") {
			const wixProduct = await getWixProductBySlug(slug);
			if (!wixProduct) return null;
			return reshapeV3FromCatalog(wixProduct, categoryNameMap);
		}

		const client = getWixClient();
		const { items } = await client.products
			.queryProducts()
			.eq("slug", slug)
			.limit(1)
			.find();
		const item = items[0] as V1Product | undefined;
		if (!item) return null;

		const collectionIds = (item.collectionIds ?? []) as string[];
		const categoryId = collectionIds[0];
		const categoryName = categoryId
			? categoryNameMap.get(categoryId)
			: undefined;
		const categories = await getStoreCategories();
		const categorySlug = categories.find((c) => c.id === categoryId)?.slug;

		return reshapeV1Product(item, categoryName, categorySlug, categoryId);
	} catch {
		return null;
	}
}

/** Alias — route param is the product slug. */
export const getProductBySlug = getCatalogProductBySlug;

export async function getProductDetailBySlug(
	slug: string
): Promise<ProductDetailData | null> {
	const catalog = await getCatalogProductBySlug(slug);
	if (!catalog) return null;

	const book = catalogProductToBookProps(catalog);

	return {
		...book,
		description: catalog.description ?? "",
		details: buildProductDetails(catalog),
		images: catalog.images,
	};
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
	minPrice?: number;
	maxPrice?: number;
}

function mapV1ItemsToBookProps(
	items: V1Product[],
	categoryNameMap: Map<string, string>,
	categories: Awaited<ReturnType<typeof getStoreCategories>>
): BookProps[] {
	return items.map((item) => {
		const collectionIds = (item.collectionIds ?? []) as string[];
		const categoryId = collectionIds[0];
		const categorySlug = categories.find((c) => c.id === categoryId)?.slug;
		const catalog = reshapeV1Product(
			item,
			categoryId ? categoryNameMap.get(categoryId) : undefined,
			categorySlug,
			categoryId
		);
		return catalogProductToBookProps(catalog);
	});
}

async function queryV1ShopItems(
	options: GetShopBooksOptions | undefined
): Promise<{ items: V1Product[]; totalCount: number }> {
	const limit = Math.min(
		Math.max(1, options?.limit ?? DEFAULT_LIMIT),
		MAX_WIX_LIMIT
	);
	const offset = Math.max(0, options?.offset ?? 0);

	if (options?.search?.trim()) {
		return queryV1ProductsViaSdk({
			limit,
			offset,
			search: options.search,
			minPrice: options?.minPrice,
			maxPrice: options?.maxPrice,
		});
	}

	if (options?.categorySlug) {
		const category = await getCategoryBySlug(options.categorySlug);
		if (!category) return { items: [], totalCount: 0 };
		return queryV1ProductsViaSdk({
			limit,
			offset,
			collectionId: category.id,
			minPrice: options?.minPrice,
			maxPrice: options?.maxPrice,
		});
	}

	return queryV1ProductsViaSdk({ 
		limit, 
		offset,
		minPrice: options?.minPrice,
		maxPrice: options?.maxPrice, 
	});
}

export async function getShopBooks(
	options?: GetShopBooksOptions
): Promise<{ books: BookProps[]; totalCount: number }> {
	if (!isWixCatalogEnabled()) return { books: [], totalCount: 0 };

	try {
		const categoryNameMap = await getCategoryNameMap();
		const version = await getCatalogVersion();

		if (version !== "V3_CATALOG") {
			const [{ items, totalCount }, categories] = await Promise.all([
				queryV1ShopItems(options),
				getStoreCategories(),
			]);
			return {
				books: mapV1ItemsToBookProps(items, categoryNameMap, categories),
				totalCount,
			};
		}

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

		return {
			books: products.map((p) => mapWixProductToBookProps(p, categoryNameMap)),
			totalCount: products.length,
		};
	} catch {
		return { books: [], totalCount: 0 };
	}
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
): Promise<{
	categoryId: string;
	categoryName: string;
	categorySlug?: string;
} | null> {
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
	if (!isWixCatalogEnabled()) return [];
	if (!product.categoryId && !product.categorySlug && !product.category) {
		return [];
	}

	try {
		const resolved = await resolveRelatedCategoryId(product);
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
		return [];
	}
}

export async function getRelatedReadsShopBooks(
	product: RelatedShopBooksOptions & { excludeBooks?: BookProps[] }
): Promise<BookProps[]> {
	const limit = product.limit ?? 4;
	const category = product.category;
	if (!isWixCatalogEnabled()) return [];

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
		return [];
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

export async function getBookProductsForBundles() {
	if (!isWixCatalogEnabled()) return [];

	try {
		const categoryNameMap = await getCategoryNameMap();
		const products = await queryWixProducts({
			limit: DEFAULT_LIMIT,
			categoryNameMap,
		});
		return products.map(mapWixProductToBook);
	} catch {
		return [];
	}
}
