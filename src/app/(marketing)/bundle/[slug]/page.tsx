import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
	getBundleMeta,
	getBundleVariantId,
} from "@/features/bundle-landing/actions/query";
import { BundleLandingPage } from "@/features/bundle-landing/BundleLandingPage";
import { getBundlePresentation, getBundlesIndex } from "@/lib/wix/bundles";
import { getMarketingBundleStaticParams } from "@/lib/wix/static-params";

export const revalidate = 86_400;

export async function generateStaticParams() {
	return getMarketingBundleStaticParams();
}

interface BundleSlugPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({
	params,
}: BundleSlugPageProps): Promise<Metadata> {
	const { slug } = await params;
	const bundle = await getBundleMeta(slug);

	if (!bundle) {
		return { title: "Oops, you're in wrong shelf!" };
	}

	const title = bundle.seo.title
		? `${bundle.seo.title}`
		: `${bundle.title} · Rewaya Books`;

	const description = bundle.seo?.description || bundle.description || "";

	return {
		title,
		description,
		openGraph: {
			title,
			description: bundle.description,
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title,
			description: bundle.description,
		},
	};
}

export default async function BundleSlugPage({ params }: BundleSlugPageProps) {
	const { slug } = await params;
	const [bundle, allBundles, productVariantId] = await Promise.all([
		getBundlePresentation(slug),
		getBundlesIndex(),
		getBundleVariantId(slug),
	]);

	if (!bundle) {
		notFound();
	}

	const relatedBundles = allBundles.filter((b) => b.id !== slug);

	return (
		<BundleLandingPage
			bundle={bundle}
			productVariantId={productVariantId}
			relatedBundles={relatedBundles}
		/>
	);
}
