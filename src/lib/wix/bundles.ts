import "server-only";

import { cache } from "react";

import { getCmsItemData, readCmsField } from "./cms/record";
import { getWixClient } from "./client";
import { isWixCatalogEnabled } from "./constants";
import { resolveWixImageUrl } from "./image";
import { getWixProductById, queryWixProducts } from "./products";
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

/** Multi-reference field `bundleProducts` → Wix Stores product ids. */
function parseBundleProductIds(raw: unknown): string[] {
	if (!raw) return [];
	if (!Array.isArray(raw)) return [];

	const ids: string[] = [];
	for (const entry of raw) {
		if (typeof entry === "string" && entry.length > 0) {
			ids.push(entry);
			continue;
		}
		if (entry && typeof entry === "object") {
			const obj = entry as Record<string, unknown>;
			const id = obj._id ?? obj.id ?? obj.productId;
			if (id != null) ids.push(String(id));
		}
	}
	return [...new Set(ids)];
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

export async function getBookBundlesFromCms(): Promise<BookBundleCmsItem[]> {
	if (!isWixCatalogEnabled()) return [];

	try {
		const client = getWixClient();
		const { items } = await client.items
			.query(BOOK_BUNDLES_COLLECTION)
			.limit(100)
			.find();

		const usedSlugs = new Set<string>();
		const rows: BookBundleCmsItem[] = [];

		for (const item of items) {
			const data = getCmsItemData(item as Record<string, unknown>);
			const title = String(
				readCmsField(
					data,
					"bundleTitle",
					"title",
					"name"
				) ?? "Bundle"
			);
			const includedBookIds = parseBundleProductIds(
				readCmsField(
					data,
					"bundleProducts",
					"bundleproducts",
					"includedBookIds",
					"books"
				)
			);
			const price = parseNumber(readCmsField(data, "price", "priceAED"));
			const originalPrice = parseNumber(
				readCmsField(data, "originalPrice", "original_price", "price1")
			);
			const overview = String(
				readCmsField(data, "overview", "description") ?? ""
			);
			const imageRaw = readCmsField(
				data,
				"bundleImage",
				"image",
				"coverImage"
			);
			const coverImage =
				resolveWixImageUrl(
					imageRaw as string | { id?: string; url?: string } | undefined,
					800,
					1000
				) ?? "";

			if (!title && includedBookIds.length === 0) continue;

			const itemId =
				(item as { _id?: string })._id ??
				(data._id as string | undefined);

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
				bundleProductId: includedBookIds[0] ?? "",
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
			const includedProducts =
				bookIds.length > 0
					? await queryWixProducts({ ids: bookIds, limit: bookIds.length })
					: [];

			const checkoutProduct = row.bundleProductId
				? await getWixProductById(row.bundleProductId)
				: null;

			bundles.push(
				mapBookBundleFromCms(
					row,
					includedProducts.map(mapWixProductToBook),
					checkoutProduct
				)
			);
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
