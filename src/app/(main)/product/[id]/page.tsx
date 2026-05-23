import {
	type ProductDetailData,
	ProductDetailView,
} from "@/features/products/product-detail-view";
import type { BookProps } from "@/lib/store";
import { isWixCatalogEnabled } from "@/lib/wix/constants";
import {
	getProductBookSections,
	getWixProductById,
	getWixProductBySlug,
} from "@/lib/wix/products";
import { getProductStaticParams } from "@/lib/wix/static-params";
import type { WixCatalogProduct } from "@/lib/wix/types";
import { mapWixProductToBookProps } from "@/lib/wix/types";

export const revalidate = 86_400;

export async function generateStaticParams() {
	return getProductStaticParams();
}

function toDetailProduct(product: WixCatalogProduct): ProductDetailData {
	const book = mapWixProductToBookProps(product);
	return {
		...book,
		description: product.description ?? "",
		details: [
			{ label: "Language", value: product.language ?? "—" },
			{ label: "Publisher", value: product.publisher ?? "—" },
			{ label: "ISBN", value: product.sku ?? "—" },
		],
	};
}

export default async function ProductDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	let product: WixCatalogProduct | null = null;
	if (isWixCatalogEnabled()) {
		product = (await getWixProductBySlug(id)) ?? (await getWixProductById(id));
	}

	const detail = product ? toDetailProduct(product) : null;

	const bookSections =
		detail || !isWixCatalogEnabled()
			? await getProductBookSections({
					wixProductId: detail?.wixProductId,
					slug: detail?.slug,
					categoryId: detail?.categoryId,
					categorySlug: detail?.categorySlug,
					category: detail?.category,
					id: detail?.id ?? (Number.parseInt(id, 10) || 1),
				})
			: { sameCategory: [] as BookProps[], relatedReads: [] as BookProps[] };

	return (
		<ProductDetailView
			id={id}
			product={detail}
			relatedReads={bookSections.relatedReads}
			sameCategoryBooks={bookSections.sameCategory}
		/>
	);
}
