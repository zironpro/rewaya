import type { Book, Bundle } from "@/lib/bundles-data";
import type { BookProps } from "@/lib/store";

export type { Book, Bundle };

export interface WixCatalogProduct {
	id: string;
	name: string;
	slug: string;
	description?: string;
	sku?: string;
	visible?: boolean;
	price?: number;
	formattedPrice?: string;
	currency?: string;
	imageUrl?: string;
	author?: string;
	publisher?: string;
	language?: string;
	genre?: string;
	collectionIds?: string[];
	categoryIds?: string[];
	categoryNames?: string[];
	primaryCategoryId?: string;
	primaryCategorySlug?: string;
	productPagePath?: string;
}

export interface BundleDetailsCmsItem {
	_id?: string;
	slug: string;
	tag?: string;
	originalPrice?: number;
	bundleProductId: string;
	includedBookIds?: string[];
	title?: string;
}

export function mapWixProductToBook(product: WixCatalogProduct): Book {
	return {
		id: product.id ?? product.slug ?? "",
		title: product.name,
		isbn: product.sku ?? "",
		publisher: product.publisher ?? "",
		author: product.author ?? "Unknown",
		language: product.language ?? "English",
		genre: product.categoryNames?.[0] ?? product.genre ?? "Books",
		overview: product.description ?? "",
		image: product.imageUrl ?? "",
		price: product.price ?? 0,
		originalPrice: 0,
	};
}

export function mapWixProductToBookProps(
	product: WixCatalogProduct,
	categoryNameMap?: Map<string, string>
): BookProps {
	const wixId = product.id ?? product.slug ?? "";
	const numericId =
		Number.parseInt(wixId.replace(/\D/g, "").slice(0, 8), 10) ||
		Math.abs(hashCode(wixId || product.name || "product"));

	const categoryFromIds = (product.categoryIds ?? product.collectionIds ?? [])
		.map((id) => categoryNameMap?.get(id))
		.filter((name): name is string => Boolean(name));

	const category =
		product.categoryNames?.[0] ??
		categoryFromIds[0] ??
		product.genre ??
		"Books";

	return {
		id: numericId,
		wixProductId: product.id,
		slug: product.slug,
		title: product.name,
		author: product.author ?? "Unknown",
		price: product.price ?? 0,
		image: product.imageUrl ?? "",
		category,
		categoryId: product.primaryCategoryId ?? product.categoryIds?.[0],
		categorySlug: product.primaryCategorySlug,
	};
}

function hashCode(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i);
		hash |= 0;
	}
	return hash;
}

export function mapToBundle(
	details: BundleDetailsCmsItem,
	storeProduct: WixCatalogProduct,
	includedBooks: Book[]
): Bundle {
	return {
		id: details.slug,
		title: details.title ?? storeProduct.name,
		price: storeProduct.price ?? 0,
		originalPrice: details.originalPrice ?? storeProduct.price ?? 0,
		tag: details.tag ?? "",
		coverImage: storeProduct.imageUrl ?? "",
		books: includedBooks,
		wixProductId: storeProduct.id,
		tagline: "",
		description: "",
		longDescription: "",
		faqs: [],
	};
}
