import { MetadataRoute } from "next";

import { BASE_URL } from "@/constants/site-config";
import {
	getBundleStaticParams,
	getMarketingBundleStaticParams,
	getProductStaticParams,
} from "@/lib/wix/static-params";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = BASE_URL;

	// Fetch dynamic routes
	const [products, bundles, marketingBundles] = await Promise.all([
		getProductStaticParams().catch(() => []),
		getBundleStaticParams().catch(() => []),
		getMarketingBundleStaticParams().catch(() => []),
	]);

	const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
		url: `${baseUrl}/product/${product.id}`,
		lastModified: new Date(),
		changeFrequency: "daily",
		priority: 0.8,
	}));

	const bundleUrls: MetadataRoute.Sitemap = bundles.map((bundle) => ({
		url: `${baseUrl}/bundles/${bundle.id}`,
		lastModified: new Date(),
		changeFrequency: "daily",
		priority: 0.7,
	}));

	const marketingBundleUrls: MetadataRoute.Sitemap = marketingBundles.map(
		(bundle) => ({
			url: `${baseUrl}/bundle/${bundle.slug}`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.7,
		})
	);

	const staticRoutes: MetadataRoute.Sitemap = [
		"",
		"/about",
		"/contact",
		"/shop",
		"/accessibility",
		"/cookies",
		"/privacy",
		"/return",
		"/terms",
	].map((route) => ({
		url: `${baseUrl}${route}`,
		lastModified: new Date(),
		changeFrequency: "weekly",
		priority: route === "" ? 1 : 0.6,
	}));

	return [
		...staticRoutes,
		...productUrls,
		...bundleUrls,
		...marketingBundleUrls,
	];
}
