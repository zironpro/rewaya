import {
	type ProductDetailData,
	ProductDetailView,
} from "@/features/products/product-detail-view";
import { isWixCatalogEnabled } from "@/lib/wix/constants";
import { getWixProductById, getWixProductBySlug } from "@/lib/wix/products";
import type { WixCatalogProduct } from "@/lib/wix/types";
import { mapWixProductToBookProps } from "@/lib/wix/types";

// export const revalidate = 86_400;

// export async function generateStaticParams() {
// 	return getProductStaticParams();
// }

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
		product = (await getWixProductBySlug(id)) ?? (await getWixProductById(id));
	}

	// const { queryProducts } = (await wixClientServer()).use(products);

	// const {items} = await queryProducts().eq("slug", id).limit(1).find()

	// console

	return (
		<ProductDetailView
			id={id}
			product={product ? toDetailProduct(product) : null}
		/>
	);
}
