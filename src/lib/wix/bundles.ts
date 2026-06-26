import { unstable_cache } from "next/cache";

import { type BundlePresentation, bundleToPresentation } from "@/domain/bundle";
import type { Book, Faq } from "@/lib/catalog/types";

import { getWixClient } from "./client";
import { getCmsItemData, readCmsField } from "./cms/record";
import { resolveWixImageUrl } from "./image";
import { queryWixProducts, searchWixProducts } from "./products";
import {
	type BookBundleCmsItem,
	type Bundle,
	mapBookBundleFromCms,
	mapWixProductToBook,
} from "./types";

/** Wix CMS collection (dashboard label: Bundles, ID: BookBundles). */
export const BOOK_BUNDLES_COLLECTION = "BookBundles" as const;
export const BUNDLE_FAQS_COLLECTION = "BundleFAQs" as const;

function parseNumber(value: unknown): number {
	if (typeof value === "number" && !Number.isNaN(value)) return value;
	if (typeof value === "string") {
		const n = Number.parseFloat(value);
		return Number.isNaN(n) ? 0 : n;
	}
	return 0;
}

function sectionValue(sections: unknown, title: string): string | undefined {
	if (!Array.isArray(sections)) return undefined;
	const key = title.toLowerCase();
	for (const entry of sections) {
		if (!entry || typeof entry !== "object") continue;
		const row = entry as { title?: string; description?: unknown };
		if (row.title?.toLowerCase() !== key) continue;
		const desc = row.description;
		return typeof desc === "string" ? desc.trim() : undefined;
	}
	return undefined;
}

/** Map an expanded Stores product object from CMS `bundleProducts` include. */
function mapCmsReferencedProductToBook(
	product: Record<string, unknown>
): Book | null {
	const id = String(product._id ?? product.id ?? "");
	if (!id) return null;

	const title = String(product.name ?? "").trim();
	if (!title) return null;

	const imageRaw =
		product.mainMedia ??
		(Array.isArray(product.mediaItems) && product.mediaItems[0]
			? (product.mediaItems[0] as { src?: string }).src
			: undefined);

	const image =
		resolveWixImageUrl(
			imageRaw as string | { id?: string; url?: string } | undefined,
			400,
			500
		) ?? "";

	const sections = product.additionalInfoSections;

	return {
		id,
		title,
		isbn: String(product.sku ?? ""),
		publisher: sectionValue(sections, "Publisher") ?? "",
		author: sectionValue(sections, "Author") ?? "Unknown",
		language: sectionValue(sections, "Language") ?? "English",
		genre: "Books",
		overview: String(product.description ?? ""),
		image,
		price: parseNumber(product.price),
		originalPrice: 0,
	};
}

interface ParsedBundleProducts {
	ids: string[];
	books: Book[];
}

/** CMS text or product-reference field → Stores/CMS catalog item id. */
function parseCmsProductIdField(raw: unknown): string | undefined {
	if (!raw) return undefined;
	if (typeof raw === "string") {
		const id = raw.trim();
		return id || undefined;
	}
	if (Array.isArray(raw) && raw.length > 0) {
		return parseCmsProductIdField(raw[0]);
	}
	if (typeof raw === "object") {
		const obj = raw as Record<string, unknown>;
		const id =
			obj._id ?? obj.id ?? obj.productId ?? obj.catalogItemId ?? obj.itemId;
		if (id != null) {
			const s = String(id).trim();
			return s || undefined;
		}
	}
	return undefined;
}

/** Scan CMS row for product-reference fields (dynamic Wix keys). */
function findCmsProductReferenceInData(
	data: Record<string, unknown>
): string | undefined {
	const hints = [
		"bundleproductid",
		"bundleproduct",
		"bundle_product",
		"wixproductid",
		"wixproduct",
		"storesproduct",
	];

	for (const [key, value] of Object.entries(data)) {
		const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, "");
		if (normalized === "bundleproducts") continue;
		if (!hints.some((hint) => normalized.includes(hint))) continue;
		const id = parseCmsProductIdField(value);
		if (id) return id;
	}
	return undefined;
}

function normalizeTitleForMatch(title: string): string {
	return title.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeToken(value: unknown): string | undefined {
	if (value == null) return undefined;
	const token = String(value).trim().toLowerCase();
	return token || undefined;
}

function toIdCandidates(value: unknown): string[] {
	if (value == null) return [];
	if (Array.isArray(value)) {
		return [
			...new Set(
				value.flatMap((entry) => toIdCandidates(entry)).filter(Boolean)
			),
		];
	}
	if (typeof value === "object") {
		const obj = value as Record<string, unknown>;
		return [
			obj._id,
			obj.id,
			obj.bundleId,
			obj.bundleid,
			obj.itemId,
			obj.slug,
			obj.bundleSlug,
			obj.bundleslug,
			obj.title,
			obj.bundleTitle,
			obj.bundletitle,
		]
			.map(normalizeToken)
			.filter((token): token is string => Boolean(token));
	}
	const single = normalizeToken(value);
	return single ? [single] : [];
}

function readFirstStringField(
	data: Record<string, unknown>,
	...keys: string[]
): string | undefined {
	const value = readCmsField(data, ...keys);
	if (typeof value !== "string") return undefined;
	const normalized = value.trim();
	return normalized || undefined;
}

/** Match a Wix Stores product to a BookBundles title when `bundleProductId` is empty. */
async function findStoresBundleProductIdByTitle(
	title: string
): Promise<string | undefined> {
	const target = normalizeTitleForMatch(title);
	if (!target) return undefined;

	const products = await searchWixProducts({ query: title.trim(), limit: 12 });
	if (products.length === 0) return undefined;

	const exact = products.find((p) => normalizeTitleForMatch(p.name) === target);
	return exact?.id;
}

function extractFaqFromCmsItem(item: Record<string, unknown>): Faq | null {
	const data = getCmsItemData(item);
	const question = readFirstStringField(
		data,
		"question",
		"faqQuestion",
		"faq_question",
		"title",
		"name"
	);
	const answer = readFirstStringField(
		data,
		"answer",
		"faqAnswer",
		"faq_answer",
		"description",
		"body"
	);
	if (!question || !answer) return null;

	const rawId =
		(item as { _id?: string; id?: string })._id ?? (item as { id?: string }).id;
	const id = String(rawId ?? `${question}-${answer}`).trim();

	return { id, question, answer };
}

function extractFaqBundleTokens(item: Record<string, unknown>): Set<string> {
	const data = getCmsItemData(item);
	const tokens = new Set<string>();
	const addTokens = (value: unknown) => {
		for (const token of toIdCandidates(value)) tokens.add(token);
	};

	addTokens(
		readCmsField(
			data,
			"bundle",
			"bundles",
			"bundleRef",
			"bundleReference",
			"bookBundle",
			"bookBundles",
			"bookbundle",
			"bookbundles",
			"bundleId",
			"bundleid",
			"bundleSlug",
			"bundleslug",
			"bundleTitle",
			"bundletitle"
		)
	);

	for (const [key, value] of Object.entries(data)) {
		const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, "");
		if (!normalized.includes("bundle")) continue;
		addTokens(value);
	}

	return tokens;
}

function resolveBundleFaqs(
	bundleRow: BookBundleCmsItem,
	faqItems: Array<{ faq: Faq; tokens: Set<string> }>
): Faq[] {
	const candidates = new Set<string>();
	const bundleId = bundleRow._id ? normalizeToken(bundleRow._id) : undefined;
	const bundleSlug = normalizeToken(bundleRow.slug);
	const bundleTitle = normalizeToken(bundleRow.title);

	if (bundleId) candidates.add(bundleId);
	if (bundleSlug) candidates.add(bundleSlug);
	if (bundleTitle) candidates.add(bundleTitle);

	const matched: Faq[] = [];
	for (const item of faqItems) {
		if (item.tokens.size === 0) continue;
		const hasMatch = [...candidates].some((token) => item.tokens.has(token));
		if (hasMatch) matched.push(item.faq);
	}
	return matched;
}

async function getBundleFaqItems(): Promise<
	Array<{ faq: Faq; tokens: Set<string> }>
> {
	try {
		const client = await getWixClient();
		const { items } = await client.items
			.query(BUNDLE_FAQS_COLLECTION)
			.limit(500)
			.find();

		const parsed = (items as Array<Record<string, unknown>>)
			.map((item) => {
				const faq = extractFaqFromCmsItem(item);
				if (!faq) return null;
				const tokens = extractFaqBundleTokens(item);
				return { faq, tokens };
			})
			.filter(
				(entry): entry is { faq: Faq; tokens: Set<string> } => entry !== null
			);
		return parsed;
	} catch (error) {
		if (process.env.NODE_ENV === "development") {
			console.error("[BundleFAQs] query failed:", error);
		}
		return [];
	}
}

export interface BundleCatalogLookupEntry {
	slug: string;
	title: string;
	coverImage: string;
	checkoutCatalogItemId: string;
	checkoutCatalogAppId: string;
}

/** Map catalog line ids → bundle metadata for cart enrichment. */
export function buildBundleCatalogLookup(
	bundles: Bundle[]
): Map<string, BundleCatalogLookupEntry> {
	const map = new Map<string, BundleCatalogLookupEntry>();

	for (const bundle of bundles) {
		const entry: BundleCatalogLookupEntry = {
			slug: bundle.id,
			title: bundle.title,
			coverImage: bundle.coverImage,
			checkoutCatalogItemId: bundle.checkoutCatalogItemId,
			checkoutCatalogAppId: bundle.checkoutCatalogAppId,
		};

		const keys = new Set<string>();
		if (bundle.checkoutCatalogItemId) keys.add(bundle.checkoutCatalogItemId);
		if (bundle.bundleProductId) keys.add(bundle.bundleProductId);

		for (const key of keys) {
			map.set(key, entry);
		}
	}

	return map;
}

/** Text/array `productIds` field (comma-separated or JSON array). */
function parseProductIdsField(raw: unknown): string[] {
	if (!raw) return [];
	if (Array.isArray(raw)) {
		return raw
			.map((entry) =>
				typeof entry === "string" ? entry.trim() : String(entry)
			)
			.filter(Boolean);
	}
	if (typeof raw === "string") {
		const trimmed = raw.trim();
		if (!trimmed) return [];
		if (trimmed.startsWith("[")) {
			try {
				const parsed = JSON.parse(trimmed) as unknown;
				return parseProductIdsField(parsed);
			} catch {
				/* fall through */
			}
		}
		return trimmed
			.split(/[,;\s]+/)
			.map((id) => id.trim())
			.filter(Boolean);
	}
	return [];
}

/** Multi-reference `bundleProducts` — ids and/or expanded Stores product objects. */
function parseBundleProducts(raw: unknown): ParsedBundleProducts {
	if (!raw) return { ids: [], books: [] };
	if (!Array.isArray(raw)) return { ids: [], books: [] };

	const ids: string[] = [];
	const books: Book[] = [];

	for (const entry of raw) {
		if (typeof entry === "string" && entry.length > 0) {
			ids.push(entry);
			continue;
		}
		if (!entry || typeof entry !== "object") continue;

		const obj = entry as Record<string, unknown>;
		if (typeof obj.name === "string") {
			const book = mapCmsReferencedProductToBook(obj);
			if (book) {
				books.push(book);
				ids.push(book.id);
			}
			continue;
		}

		const id = obj._id ?? obj.id ?? obj.productId;
		if (id != null) ids.push(String(id));
	}

	return { ids: [...new Set(ids)], books };
}

function slugifyTitle(title: string): string {
	return title
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function resolveBundleSlug(
	title: string,
	itemId: string | undefined,
	usedSlugs: Set<string>
): string {
	const base = slugifyTitle(title) || itemId || "bundle";
	let slug = base;
	let n = 2;
	while (usedSlugs.has(slug)) {
		slug = `${base}-${n}`;
		n += 1;
	}
	usedSlugs.add(slug);
	return slug;
}

async function resolveIncludedBooks(
	bookIds: string[],
	cmsBooks: Book[]
): Promise<Book[]> {
	const byId = new Map(cmsBooks.map((book) => [book.id, book]));
	const missingIds = bookIds.filter((id) => !byId.has(id));

	if (missingIds.length > 0) {
		const fetched = await queryWixProducts({
			ids: missingIds,
			limit: missingIds.length,
		});
		for (const product of fetched) {
			const book = mapWixProductToBook(product);
			byId.set(book.id, book);
		}
	}

	return bookIds
		.map((id) => byId.get(id))
		.filter((book): book is Book => book != null);
}

export async function getBookBundlesFromCms(): Promise<BookBundleCmsItem[]> {
	try {
		const client = await getWixClient();
		const { items } = await client.items
			.query(BOOK_BUNDLES_COLLECTION)
			.include("bundleProducts")
			.limit(100)
			.find();
		const faqItems = await getBundleFaqItems();

		const usedSlugs = new Set<string>();
		const rows: BookBundleCmsItem[] = [];

		for (const item of items) {
			const data = getCmsItemData(item as Record<string, unknown>);
			const title = String(
				readCmsField(data, "bundleTitle", "title", "name") ?? "Bundle"
			);
			const bundleProductsRaw = readCmsField(
				data,
				"bundleProducts",
				"bundleproducts",
				"includedBookIds",
				"books"
			);
			const productIdsRaw = readCmsField(
				data,
				"productIds",
				"productids",
				"product_ids"
			);
			const parsedRefs = parseBundleProducts(bundleProductsRaw);
			const explicitIds = parseProductIdsField(productIdsRaw);
			const includedBookIds = [...new Set([...parsedRefs.ids, ...explicitIds])];
			const includedBooks = parsedRefs.books;
			const price = parseNumber(readCmsField(data, "price", "priceAED"));
			const originalPrice = parseNumber(
				readCmsField(data, "originalPrice", "original_price", "price1")
			);
			const overview = String(
				readCmsField(data, "overview", "description") ?? ""
			);
			const imageRaw = readCmsField(data, "bundleImage", "image", "coverImage");
			const coverImage =
				resolveWixImageUrl(
					imageRaw as string | { id?: string; url?: string } | undefined,
					800,
					1000
				) ?? "";

			const itemId =
				(item as { _id?: string })._id ?? (data._id as string | undefined);

			if (!itemId || (!title && includedBookIds.length === 0)) continue;

			const slug = resolveBundleSlug(title, itemId, usedSlugs);
			const bundleProductIdRaw = readCmsField(
				data,
				"bundleProductId",
				"bundle_product_id",
				"wixProductId",
				"bundleProduct",
				"bundle_product"
			);
			let bundleProductId =
				parseCmsProductIdField(bundleProductIdRaw) ??
				findCmsProductReferenceInData(data);

			if (!bundleProductId) {
				bundleProductId = await findStoresBundleProductIdByTitle(title);
			}

			const shopifyVariantId =
				(readCmsField(
					data,
					"shopifyVariantId",
					"shopify_variant_id",
					"shopifyVariant",
					"shopify_variant"
				) as string | undefined) ?? undefined;

			const shopifyProductHandle =
				(readCmsField(
					data,
					"shopifyProductHandle",
					"shopify_product_handle",
					"shopifyHandle",
					"shopify_product"
				) as string | undefined) ?? undefined;

			rows.push({
				_id: itemId,
				slug,
				title,
				overview,
				price,
				originalPrice: originalPrice > 0 ? originalPrice : price,
				coverImage,
				quantityAvailable: parseNumber(
					readCmsField(data, "quantityAvailable", "quantity")
				),
				includedBookIds,
				includedBooks: includedBooks.length > 0 ? includedBooks : undefined,
				cmsCatalogItemId: itemId,
				bundleProductId,
				shopifyVariantId,
				shopifyProductHandle,
				tag: readCmsField(data, "tag", "ribbon") as string | undefined,
			});
		}

		if (faqItems.length > 0) {
			for (const row of rows) {
				row.faqs = resolveBundleFaqs(row, faqItems);
			}
		}

		// if (process.env.NODE_ENV === "development" && rows.length > 0) {
		// 	const first = rows[0];
		// 	console.log(
		// 		"[BookBundles] loaded",
		// 		rows.length,
		// 		"row(s); first mapped:",
		// 		{
		// 			slug: first?.slug,
		// 			bundleProductId: first?.bundleProductId ?? "(none)",
		// 			cmsCatalogItemId: first?.cmsCatalogItemId,
		// 			checkout: resolveBundleCheckout({
		// 				bundleProductId: first?.bundleProductId,
		// 				cmsCatalogItemId: first?.cmsCatalogItemId ?? "",
		// 			}),
		// 			includedBookIds: first?.includedBookIds?.length ?? 0,
		// 		}
		// 	);
		// }

		return rows;
	} catch (error) {
		if (process.env.NODE_ENV === "development") {
			console.error("[BookBundles] getBookBundlesFromCms failed:", error);
		}
		return [];
	}
}

export async function getBundles(): Promise<Bundle[]> {
	try {
		const cmsRows = await getBookBundlesFromCms();
		if (cmsRows.length === 0) return [];

		const bundles: Bundle[] = [];

		for (const row of cmsRows) {
			const bookIds = row.includedBookIds;
			const includedBooks =
				bookIds.length > 0
					? await resolveIncludedBooks(bookIds, row.includedBooks ?? [])
					: [];

			bundles.push(mapBookBundleFromCms(row, includedBooks));
		}

		return bundles;
	} catch {
		return [];
	}
}

export const getCachedBundles = unstable_cache(getBundles, ["wix-bundles-v1"], {
	revalidate: 3600,
	tags: ["bundles"],
});
export async function getBundleBySlug(slug: string): Promise<Bundle | null> {
	const all = await getCachedBundles();
	return all.find((b) => b.id === slug) ?? null;
}

/** All bundles for index pages (`/bundle`, `/bundles`). */
export async function getBundlesIndex(): Promise<Bundle[]> {
	return getCachedBundles();
}

export async function getBundlePresentation(
	slug: string
): Promise<BundlePresentation | null> {
	const bundle = await getBundleBySlug(slug);
	return bundle ? bundleToPresentation(bundle) : null;
}
