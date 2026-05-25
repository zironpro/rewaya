import type { Book, Bundle, Faq } from "@/lib/catalog/types";
import type { BookProps } from "@/lib/store";
import type { ProductVariant } from "./catalog-types";
import type { ProductInfoSection } from "./info-sections";
import {
	buildV3VariantsFromCatalog,
	wixCatalogToBookProps,
} from "./reshape-product";

export type { Book, Bundle, Faq };

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
	infoSections?: ProductInfoSection[];
	genre?: string;
	collectionIds?: string[];
	categoryIds?: string[];
	categoryNames?: string[];
	primaryCategoryId?: string;
	primaryCategorySlug?: string;
	productPagePath?: string;
	variantId?: string;
}

/** Row from Wix CMS `BookBundles` collection. */
export interface BookBundleCmsItem {
	_id?: string;
	slug: string;
	title: string;
	overview: string;
	price: number;
	originalPrice: number;
	coverImage: string;
	quantityAvailable?: number;
	includedBookIds: string[];
	/** Stores catalog id used for add-to-cart (first `bundleProducts` ref). */
	bundleProductId: string;
	tag?: string;
}

/** @deprecated Use `BookBundleCmsItem`. */
export type BundleDetailsCmsItem = BookBundleCmsItem;

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
	categoryNameMap?: Map<string, string>,
	variants?: ProductVariant[]
): BookProps {
	const resolvedVariants =
		variants ?? buildV3VariantsFromCatalog(product, product.variantId);
	return wixCatalogToBookProps(product, categoryNameMap, resolvedVariants);
}

export function mapBookBundleFromCms(
	details: BookBundleCmsItem,
	includedBooks: Book[],
	checkoutProduct?: WixCatalogProduct | null
): Bundle {
	const variants = checkoutProduct
		? buildV3VariantsFromCatalog(checkoutProduct, checkoutProduct.variantId)
		: undefined;

	const overview = details.overview.trim();
	const tagline =
		overview.length > 120 ? `${overview.slice(0, 117)}…` : overview;

	return {
		id: details.slug,
		title: details.title,
		price: details.price,
		originalPrice: details.originalPrice,
		tag: details.tag ?? "Bundle",
		tagline,
		description: overview,
		longDescription: overview,
		coverImage:
			details.coverImage ||
			includedBooks[0]?.image ||
			checkoutProduct?.imageUrl ||
			"",
		books: includedBooks,
		wixProductId:
			details.bundleProductId ||
			checkoutProduct?.id ||
			includedBooks[0]?.id,
		variants,
		defaultVariant: variants?.[0],
		faqs: [],
	};
}

/** @deprecated Use `mapBookBundleFromCms`. */
export function mapToBundle(
	details: BookBundleCmsItem,
	storeProduct: WixCatalogProduct,
	includedBooks: Book[]
): Bundle {
	return mapBookBundleFromCms(details, includedBooks, storeProduct);
}
