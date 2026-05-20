import "server-only";

import { bundles as staticBundles } from "@/lib/bundles-data";

import { getWixClient } from "./client";
import { isWixCatalogEnabled } from "./constants";
import { getWixProductById, queryWixProducts } from "./products";
import {
	type Bundle,
	type BundleDetailsCmsItem,
	mapToBundle,
	mapWixProductToBook,
} from "./types";

const BUNDLE_DETAILS_COLLECTION = "Bundles";

export async function getBundleDetailsFromCms(): Promise<
	BundleDetailsCmsItem[]
> {
	if (!isWixCatalogEnabled()) return [];

	const client = getWixClient();
	const result = await client.items
		.query(BUNDLE_DETAILS_COLLECTION)
		.limit(100)
		.find();

	console.log(result.items);

	return result.items.map((item) => {
		const rawIds = item.data?.includedBookIds;
		let includedBookIds: string[] = [];
		if (Array.isArray(rawIds)) {
			includedBookIds = rawIds.map(String);
		} else if (typeof rawIds === "string" && rawIds.length > 0) {
			try {
				includedBookIds = JSON.parse(rawIds) as string[];
			} catch {
				includedBookIds = rawIds.split(",").map((id) => id.trim());
			}
		}

		return {
			_id: item._id ?? undefined,
			slug: String(item.data?.slug ?? item._id ?? ""),
			tag: item.data?.tag as string | undefined,
			originalPrice: item.data?.originalPrice as number | undefined,
			bundleProductId: String(item.data?.bundleProductId ?? ""),
			includedBookIds,
			title: item.data?.title as string | undefined,
		};
	});
}

export async function getBundles(): Promise<Bundle[]> {
	if (!isWixCatalogEnabled()) {
		return staticBundles;
	}

	try {
		const detailsList = await getBundleDetailsFromCms();

		if (detailsList.length === 0) {
			return staticBundles;
		}

		const bundles: Bundle[] = [];

		for (const details of detailsList) {
			const storeProduct = await getWixProductById(details.bundleProductId);
			if (!storeProduct) continue;

			const bookIds = details.includedBookIds ?? [];
			const includedProducts =
				bookIds.length > 0
					? await queryWixProducts({ ids: bookIds, limit: bookIds.length })
					: [];

			bundles.push(
				mapToBundle(
					details,
					storeProduct,
					includedProducts.map(mapWixProductToBook)
				)
			);
		}

		return bundles.length > 0 ? bundles : staticBundles;
	} catch {
		return staticBundles;
	}
}

export async function getBundleBySlug(slug: string): Promise<Bundle | null> {
	const all = await getBundles();
	return all.find((b) => b.id === slug) ?? null;
}
