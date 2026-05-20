import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BundleLandingPage } from "@/features/bundle-landing/BundleLandingPage";
import { getBundleBySlug } from "@/features/bundle-landing/lib/bundleData";

interface BundleSlugPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({
	params,
}: BundleSlugPageProps): Promise<Metadata> {
	const { slug } = await params;
	const bundle = getBundleBySlug(slug);
	if (!bundle) {
		return { title: "Bundle" };
	}
	const title = `${bundle.name} · Rewaya Book world`;
	return {
		title,
		description: bundle.description,
		openGraph: {
			title: bundle.name,
			description: bundle.description,
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: bundle.name,
			description: bundle.description,
		},
	};
}

export default async function BundleSlugPage({ params }: BundleSlugPageProps) {
	const { slug } = await params;
	const bundle = getBundleBySlug(slug);

	if (!bundle) {
		notFound();
	}
	return <BundleLandingPage bundle={bundle} />;
}
