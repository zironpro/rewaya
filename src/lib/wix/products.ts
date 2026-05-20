import "server-only";

import { allBooks as staticBooks } from "@/features/products/data/products";
import { bundles as staticBundles } from "@/lib/bundles-data";

import { getCatalogVersion, getWixClient } from "./client";
import { isWixCatalogEnabled } from "./constants";
import {
	mapWixProductToBook,
	mapWixProductToBookProps,
	type WixCatalogProduct,
} from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type V1Product = Record<string, any>;

function getInfoSection(product: V1Product, title: string): string | undefined {
	const sections = product.additionalInfoSections as
		| Array<{ title?: string; description?: string }>
		| undefined;
	return sections?.find((s) => s.title === title)?.description;
}

function mapV1Product(product: V1Product): WixCatalogProduct {
	const priceData = product.priceData ?? product.price;
	const mainImage =
		product.media?.mainMedia?.image?.url ??
		product.media?.mainMedia?.thumbnail?.url;

	return {
		id: product.id as string,
		name: product.name as string,
		slug: product.slug as string,
		description: product.description as string | undefined,
		sku: product.sku as string | undefined,
		visible: product.visible as boolean | undefined,
		price: priceData?.price as number | undefined,
		formattedPrice: priceData?.formatted?.price as string | undefined,
		currency: priceData?.currency as string | undefined,
		imageUrl: mainImage as string | undefined,
		author: getInfoSection(product, "Author"),
		publisher: getInfoSection(product, "Publisher"),
		language: getInfoSection(product, "Language"),
		genre: product.ribbon as string | undefined,
		productPagePath: product.productPageUrl?.path as string | undefined,
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapV3Product(product: Record<string, any>): WixCatalogProduct {
	const variant = product.variantsInfo?.variants?.[0];
	const price = variant?.price?.actualPrice?.amount;
	const image = product.media?.main?.image?.url;

	return {
		id: product.id as string,
		name: product.name as string,
		slug: product.slug as string,
		description: product.description as string | undefined,
		visible: product.visible as boolean | undefined,
		price: price != null ? Number(price) : undefined,
		imageUrl: image as string | undefined,
		productPagePath: product.productPageUrl?.path as string | undefined,
	};
}

export async function queryWixProducts(options?: {
	limit?: number;
	offset?: number;
	slugs?: string[];
	ids?: string[];
}): Promise<WixCatalogProduct[]> {
	if (!isWixCatalogEnabled()) return [];

	const client = getWixClient();
	const version = await getCatalogVersion();
	const limit = options?.limit ?? 48;
	const offset = options?.offset ?? 0;

	if (version === "V3_CATALOG") {
		let query = client.productsV3.queryProducts({
			fields: ["URL", "DESCRIPTION"],
		});

		if (options?.ids?.length) {
			query = query.in("_id", options.ids);
		}

		const { items } = await query.limit(limit).skipTo(String(offset)).find();
		return items.map(mapV3Product);
	}

	let query = client.products.queryProducts().eq("visible", true);

	if (options?.slugs?.length === 1) {
		query = query.eq("slug", options.slugs[0]);
	} else if (options?.ids?.length) {
		query = query.in("id", options.ids);
	}

	const { items } = await query.limit(limit).skip(offset).find();
	return items.map(mapV1Product);
}

export async function getWixProductBySlug(
	slug: string
): Promise<WixCatalogProduct | null> {
	const products = await queryWixProducts({ slugs: [slug], limit: 1 });
	return products[0] ?? null;
}

export async function getWixProductById(
	id: string
): Promise<WixCatalogProduct | null> {
	const products = await queryWixProducts({ ids: [id], limit: 1 });
	return products[0] ?? null;
}

export async function getShopBooks() {
	if (!isWixCatalogEnabled()) {
		return staticBooks;
	}

	try {
		const products = await queryWixProducts({ limit: 48 });
		return products.map(mapWixProductToBookProps);
	} catch {
		return staticBooks;
	}
}

export async function getBookProductsForBundles() {
	if (!isWixCatalogEnabled()) {
		return staticBundles.flatMap((b) => b.books);
	}

	try {
		const products = await queryWixProducts({ limit: 100 });
		return products.map(mapWixProductToBook);
	} catch {
		return staticBundles.flatMap((b) => b.books);
	}
}
