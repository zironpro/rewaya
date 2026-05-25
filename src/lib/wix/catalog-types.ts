/** Cart / catalog variant shape (aligned with wix/headless-templates nextjs/commerce). */

import type { ProductInfoSection } from "./info-sections";

export const PLACEHOLDER_VARIANT_ID = "00000000-0000-0000-0000-000000000000";

export interface ProductVariantOption {
	name?: string;
	value?: string;
}

export interface ProductVariant {
	id: string;
	title?: string;
	availableForSale?: boolean;
	selectedOptions: ProductVariantOption[];
	price?: {
		amount?: string;
		currencyCode?: string;
	};
}

export interface CatalogProduct {
	id: string;
	slug: string;
	title: string;
	description?: string;
	availableForSale: boolean;
	price: number;
	currency?: string;
	image: string;
	images?: string[];
	category: string;
	categoryId?: string;
	categorySlug?: string;
	author?: string;
	publisher?: string;
	language?: string;
	/** Wix Stores additional info sections (Publisher, Author, Language, etc.). */
	infoSections?: ProductInfoSection[];
	sku?: string;
	variants: ProductVariant[];
	defaultVariant?: ProductVariant;
}
