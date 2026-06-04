import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailView } from "@/features/products/product-detail-view";
import { isWixCatalogEnabled } from "@/lib/wix/constants";
import {
	getProductBookSections,
	getProductDetailBySlug,
} from "@/lib/wix/products";
import { getProductStaticParams } from "@/lib/wix/static-params";

export const revalidate = 86_400;

export async function generateStaticParams() {
	if (!isWixCatalogEnabled()) return [];
	return getProductStaticParams();
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	if (!isWixCatalogEnabled()) return {};

	const { id } = await params;
	const detail = await getProductDetailBySlug(id);

	if (!detail) {
		return {
			title: "Product Not Found · Rewaya Book world",
		};
	}

	const title = detail.author
		? `${detail.title} by ${detail.author} · Rewaya Book world`
		: `${detail.title} · Rewaya Book world`;

	const description = detail.description
		? detail.description
				.replace(/<[^>]*>/g, "")
				.trim()
				.substring(0, 160)
		: `Buy ${detail.title} online at Rewaya Book World.`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: "website",
			images: detail.image ? [{ url: detail.image }] : [],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: detail.image ? [detail.image] : [],
		},
	};
}

export default async function ProductDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	if (!isWixCatalogEnabled()) {
		notFound();
	}

	const detail = await getProductDetailBySlug(id);
	if (!detail) {
		notFound();
	}

	const bookSections = await getProductBookSections({
		wixProductId: detail.wixProductId,
		slug: detail.slug,
		categoryId: detail.categoryId,
		categorySlug: detail.categorySlug,
		category: detail.category,
		id: detail.id,
	});

	return (
		<ProductDetailView
			product={detail}
			relatedReads={bookSections.relatedReads}
			sameCategoryBooks={bookSections.sameCategory}
		/>
	);
}
