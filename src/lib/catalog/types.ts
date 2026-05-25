/** Shared catalog types (Wix Stores + CMS). */

export interface Book {
	id: string;
	title: string;
	isbn: string;
	publisher: string;
	author?: string;
	language?: string;
	genre?: string;
	overview: string;
	image: string;
	price: number;
	originalPrice: number;
}

export interface RelatedBundle {
	href: string;
	name: string;
	price: number;
	originalPrice: number;
	imageUrl: string;
	tag: string;
}

export interface Faq {
	id: string;
	question: string;
	answer: string;
}

export interface Bundle {
	id: string;
	title: string;
	price: number;
	originalPrice: number;
	tag: string;
	tagline: string;
	description: string;
	longDescription: string;
	coverImage: string;
	books: Book[];
	/** Wix Stores product IDs from CMS `bundleProducts` / `productIds` */
	storeProductIds: string[];
	/** @deprecated Bundles checkout via `storeProductIds`, not CMS catalog */
	wixProductId?: string;
	/** @deprecated */
	catalogAppId?: string;
	/** Default variant for add-to-cart (Stores books only) */
	defaultVariant?: import("@/lib/wix/catalog-types").ProductVariant;
	variants?: import("@/lib/wix/catalog-types").ProductVariant[];
	faqs: Faq[];
}
