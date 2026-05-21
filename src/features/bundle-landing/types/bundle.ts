export interface BookItem {
	id: string;
	title: string;
	author: string;
	coverUrl: string;
	description: string;
}

export interface Review {
	id: string;
	quote: string;
	name: string;
	location: string;
	rating: number;
}

export interface RelatedBundle {
	/** Destination on the main store (e.g. `/bundles`) */
	href: string;
	name: string;
	price: number;
	originalPrice: number;
	imageUrl: string;
	tag?: string;
}

export interface FAQ {
	id: string;
	question: string;
	answer: string;
}

export interface BundleData {
	slug: string;
	name: string;
	tagline: string;
	description: string;
	longDescription: string;
	price: number;
	originalPrice: number;
	savingsAmount: number;
	books: BookItem[];
	reviews: Review[];
	relatedBundles: RelatedBundle[];
	faqs: FAQ[];
	/** When set, primary checkout uses Wix add-to-cart */
	wixProductId?: string;
	coverImage: string;
}
