import { fetchGraphQL } from "@/lib/shopify";
import { GET_BUNDLE_META } from "@/qraphql/storefront/bundles";
import {
	GET_PRODUCT_BY_HANDLE_QUERY,
	GET_PRODUCT_VARIANT_ID_BY_HANDLE,
} from "@/qraphql/storefront/products";
import {
	GetBundleMetaQuery,
	GetProductByHandleQuery,
	GetVariantsQuery,
} from "@/types/shopify-storefront-graphql";

export async function getBundleMeta(slug: string) {
	const bundles = await fetchGraphQL<GetBundleMetaQuery>(GET_BUNDLE_META, {
		handle: slug,
	});

	console.log("Bundle meta query result for slug:", slug, bundles);

	return bundles.product;
}

export async function getBundleByHandle(handle: string) {
	const { product } = await fetchGraphQL<GetProductByHandleQuery>(
		GET_PRODUCT_BY_HANDLE_QUERY,
		{ handle }
	);

	return product;
}

export async function getBundleVariantId(handle: string) {
	const { product } = await fetchGraphQL<GetVariantsQuery>(
		GET_PRODUCT_VARIANT_ID_BY_HANDLE,
		{ handle }
	);
	return product?.variants.edges[0]?.node.id; // Assuming the first variant is the one we want. Adjust as needed.
}
