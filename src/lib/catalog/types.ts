/** Shared catalog types (Wix Stores + CMS). */

import type { ProductVariant } from "../wix/catalog-types";

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
	/** Wix Stores product ID when set on CMS (`bundleProductId`). */
	bundleProductId: string;
	/** Resolved add-to-cart catalog item id (Stores product or CMS catalog row). */
	checkoutCatalogItemId: string;
	/** Wix app id for `checkoutCatalogItemId` (Stores or CMS catalog). */
	checkoutCatalogAppId: string;
	/** Included book Stores IDs from CMS `bundleProducts` — display only. */
	storeProductIds: string[];
	/** Default variant for add-to-cart (Stores books only) */
	defaultVariant?: ProductVariant;
	variants?: ProductVariant[];
	faqs: Faq[];
}
