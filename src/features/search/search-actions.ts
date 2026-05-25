"use server";

import { searchWixProducts } from "@/lib/wix/products";

const MIN_QUERY_LENGTH = 2;
const SUGGESTION_LIMIT = 6;

export type SearchSuggestion = {
	id: string;
	slug?: string;
	title: string;
	author?: string;
	image: string;
	price: number;
};

export type SearchProductsResult = {
	results: SearchSuggestion[];
};

export async function searchProductsAction(
	query: string
): Promise<SearchProductsResult> {
	const trimmed = query.trim();
	if (trimmed.length < MIN_QUERY_LENGTH) {
		return { results: [] };
	}

	try {
		const products = await searchWixProducts({
			query: trimmed,
			limit: SUGGESTION_LIMIT,
		});

		return {
			results: products.map((product) => ({
				id: product.id,
				slug: product.slug || undefined,
				title: product.name,
				author: product.author,
				image: product.imageUrl ?? "",
				price: product.price ?? 0,
			})),
		};
	} catch {
		return { results: [] };
	}
}
