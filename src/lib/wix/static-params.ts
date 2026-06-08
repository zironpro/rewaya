import "server-only";

import { GET_BUNDLE_COLLECTION_SLUGS } from "@/qraphql/storefront/collections";
import { GetBundleCollectionSlugsQuery } from "@/types/shopify-storefront-graphql";

import { fetchGraphQL } from "../shopify";
import { getBookBundlesFromCms } from "./bundles";
import { isWixCatalogEnabled } from "./constants";
import { queryWixProducts } from "./products";

const PAGE_SIZE = 100;

export async function getProductStaticParamIds(): Promise<string[]> {
	if (!isWixCatalogEnabled()) return [];

	try {
		const ids: string[] = [];
		let offset = 0;

		while (true) {
			const batch = await queryWixProducts({ limit: PAGE_SIZE, offset });
			if (batch.length === 0) break;

			for (const product of batch) {
				const param = product.slug ?? product.id;
				if (param && product.name) ids.push(param);
			}

			if (batch.length < PAGE_SIZE) break;
			offset += PAGE_SIZE;
		}

		return ids;
	} catch {
		return [];
	}
}

export async function getBundleStaticParamSlugs(): Promise<string[]> {
	if (!isWixCatalogEnabled()) return [];

	try {
		const details = await getBookBundlesFromCms();
		return details.map((d) => d.slug).filter(Boolean);
	} catch {
		return [];
	}
}

export async function getProductStaticParams(): Promise<{ id: string }[]> {
	const ids = await getProductStaticParamIds();
	return ids.map((id) => ({ id }));
}

export async function getBundleStaticParams(): Promise<{ id: string }[]> {
	const slugs = await getBundleStaticParamSlugs();
	return slugs.map((id) => ({ id }));
}

export async function getMarketingBundleStaticParams(): Promise<
	{ slug: string }[]
> {
	const bundles = await fetchGraphQL<GetBundleCollectionSlugsQuery>(
		GET_BUNDLE_COLLECTION_SLUGS
	);

	return (
		bundles.collection?.products.nodes.map((node) => ({ slug: node.handle })) ??
		[]
	);
}
