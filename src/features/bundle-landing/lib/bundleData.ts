import type { Bundle } from "@/lib/bundles-data";
import { bundles as staticBundles } from "@/lib/bundles-data";
import { getBundleReviews } from "@/lib/bundle-reviews-data";
import { getBundleBySlug as getWixBundleBySlug } from "@/lib/wix/bundles";

import type { BundleData } from "../types/bundle";

export function mapBundleToBundleData(bundle: Bundle): BundleData {
	return {
		slug: bundle.id,
		name: bundle.title,
		tagline: bundle.tagline,
		description: bundle.description,
		longDescription: bundle.longDescription,
		price: bundle.price,
		originalPrice: bundle.originalPrice,
		savingsAmount: bundle.originalPrice - bundle.price,
		wixProductId: bundle.wixProductId,
		coverImage: bundle.coverImage,
		books: bundle.books.map((book) => ({
			id: book.id,
			title: book.title,
			author: book.author ?? book.publisher,
			coverUrl: book.image,
			description: book.overview,
		})),
		reviews: getBundleReviews(bundle.id),
		faqs: bundle.faqs,
	};
}

export async function getBundleBySlug(
	slug: string
): Promise<BundleData | null> {
	const bundle = await getWixBundleBySlug(slug);
	return bundle ? mapBundleToBundleData(bundle) : null;
}

export function getAllBundleSlugs(): string[] {
	return staticBundles.map((b) => b.id);
}
