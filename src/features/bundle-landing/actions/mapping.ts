import { GetBundleByHandleQuery } from "@/types/shopify-admin-graphql";

type RawNode = NonNullable<
	GetBundleByHandleQuery["products"]["edges"][0]["node"]
>;

export function mapBundle(data: GetBundleByHandleQuery) {
	const node = data?.products?.edges?.[0]?.node;
	if (!node) return null;

	return {
		id: node.id,
		title: node.title,
		handle: node.handle,
		status: node.status,
		productType: node.productType,
		tags: node.tags ?? [],

		priceRange: {
			min: node.priceRangeV2.minVariantPrice,
			max: node.priceRangeV2.maxVariantPrice,
		},

		variants: node.variants.edges.map((e) => e.node),

		components:
			node.bundleComponents?.edges.map((e) => ({
				quantity: e.node.quantity,
				optionSelections: e.node.optionSelections.map((sel) => ({
					componentOption: sel.componentOption,
					values: sel.values.map((v) => v.value),
				})),
				componentProduct: {
					...e.node.componentProduct,
					variants: e.node.componentProduct.variants.edges.map((ve) => ve.node),
				},
			})) ?? [],

		featuredImage: node.featuredImage ?? null,
		images: node.images.edges.map((e) => e.node),
	};
}
