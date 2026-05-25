import { notFound } from "next/navigation";

import { ProductDetailView } from "@/features/products/product-detail-view";
import { isWixCatalogEnabled } from "@/lib/wix/constants";
import {
	getProductBookSections,
	getProductDetailBySlug,
} from "@/lib/wix/products";
export const revalidate = 86_400;
export const dynamicParams = true;

/** On-demand ISR — pre-rendering the full Wix catalog at build exceeds timeouts. */
export async function generateStaticParams() {
	return [];
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
