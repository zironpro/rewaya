import "server-only";

import { cache } from "react";

import type { Book } from "@/lib/catalog/types";

import { getWixClient } from "./client";
import { getCmsItemData, readCmsField } from "./cms/record";
import { isWixCatalogEnabled } from "./constants";
import { resolveWixImageUrl } from "./image";
import { queryWixProducts } from "./products";
import {
	type BookBundleCmsItem,
	type Bundle,
	mapBookBundleFromCms,
	mapWixProductToBook,
} from "./types";

/** Wix CMS collection (dashboard label: Bundles, ID: BookBundles). */
export const BOOK_BUNDLES_COLLECTION = "BookBundles";

function parseNumber(value: unknown): number {
	if (typeof value === "number" && !Number.isNaN(value)) return value;
	if (typeof value === "string") {
		const n = Number.parseFloat(value);
		return Number.isNaN(n) ? 0 : n;
	}
	return 0;
}

function sectionValue(
	sections: unknown,
	title: string
): string | undefined {
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
	if (!isWixCatalogEnabled()) return [];

	try {
		const client = getWixClient();
		const { items } = await client.items
			.query(BOOK_BUNDLES_COLLECTION)
			.include("bundleProducts")
			.limit(100)
			.find();

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
			const { ids: includedBookIds, books: includedBooks } =
				parseBundleProducts(bundleProductsRaw);
			const price = parseNumber(
				readCmsField(data, "price", "priceAED")
			);
			const originalPrice = parseNumber(
				readCmsField(
					data,
					"originalPrice",
					"original_price",
					"price1"
				)
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
				tag: readCmsField(data, "tag", "ribbon") as string | undefined,
			});
		}

		return rows;
	} catch {
		return [];
	}
}

/** @deprecated Use `getBookBundlesFromCms`. */
export const getBundleDetailsFromCms = getBookBundlesFromCms;

export async function getBundles(): Promise<Bundle[]> {
	if (!isWixCatalogEnabled()) return [];

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

export const getCachedBundles = cache(getBundles);

export async function getBundleBySlug(slug: string): Promise<Bundle | null> {
	const all = await getCachedBundles();
	return all.find((b) => b.id === slug) ?? null;
}
