import type { ProductVariant } from "@/lib/wix/catalog-types";

export interface BookProps {
	id: number;
	/** Wix Stores product ID for headless cart */
	wixProductId?: string;
	/** URL slug from Wix catalog */
	slug?: string;
	title: string;
	author?: string;
	price: number;
	image: string;
	category: string;
	/** Wix collection/category GUID */
	categoryId?: string;
	/** Wix collection/category slug */
	categorySlug?: string;
	badge?: "new seller" | "new arrival" | "best seller";
	variants?: ProductVariant[];
	defaultVariant?: ProductVariant;
	availableForSale?: boolean;
}

/** Stable, unique React list key — avoids collisions between wixProductId and numeric id. */
export function getBookReactKey(book: BookProps, index?: number): string {
	if (book.wixProductId) return book.wixProductId;
	if (book.slug) return `slug:${book.slug}`;
	if (index !== undefined) return `book:${book.id}:${index}`;
	return `book-${index}:${book.id}`;
}
