import {
	ProductDetailView,
	type ProductDetailData,
} from "@/features/products/product-detail-view";
import { getWixProductBySlug, getWixProductById } from "@/lib/wix/products";
import { isWixCatalogEnabled } from "@/lib/wix/constants";
import { mapWixProductToBookProps } from "@/lib/wix/types";
import type { WixCatalogProduct } from "@/lib/wix/types";

export const dynamic = "force-dynamic";

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

	let product = null;
	if (isWixCatalogEnabled()) {
		product =
			(await getWixProductBySlug(id)) ?? (await getWixProductById(id));
	}

	return <ProductDetailView id={id} product={product ? toDetailProduct(product) : null} />;
}
