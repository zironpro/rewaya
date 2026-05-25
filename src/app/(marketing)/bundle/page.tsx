import type { Metadata } from "next";

import { resolveCampaignBanners } from "@/features/bundle-landing/data/bundle-campaign-banners";
import { buildBundlesIndexPageData } from "@/features/bundle-landing/lib/bundlesIndexData";
import { BundleLandingPageView } from "@/features/bundles/bundle-landing-page-view";
import { getBundles } from "@/lib/wix/bundles";

export const revalidate = 86_400;

export async function generateMetadata(): Promise<Metadata> {
	const bundles = await getBundles();
	const data = buildBundlesIndexPageData(bundles);
	const title = "Bundle deals · Rewaya Book world";
	const description = data.featuredBundle
		? `Curated book bundles from AED ${data.featuredBundle.price}. Save up to AED ${data.maxSavings} — limited-time offer. UAE delivery.`
		: "Curated book bundles and limited-time offers. UAE delivery.";

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: "website",
			images:
				data.featuredBundle?.coverImage ?
					[
						{
							url: data.featuredBundle.coverImage,
							alt: data.featuredBundle.title,
						},
					]
				:	undefined,
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
		},
	};
}

export default async function BundleIndexPage() {
	const bundles = await getBundles();
	const data = buildBundlesIndexPageData(bundles);
	const banners = resolveCampaignBanners();

	return <BundleLandingPageView banners={banners} data={data} />;
}
