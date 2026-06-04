import { ShopView } from "@/features/shop/shop-view";
import { getStoreCategories } from "@/lib/wix/categories";
import { getShopBooks } from "@/lib/wix/products";

// export const dynamic = "force-dynamic";

interface ShopPageProps {
	searchParams: Promise<{
		q?: string;
		category?: string;
		page?: string;
		limit?: string;
		minPrice?: string;
		maxPrice?: string;
	}>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
	const { q, category, page, limit, minPrice, maxPrice } = await searchParams;

	const currentPage = Math.max(1, Number.parseInt(page ?? "1", 10) || 1);
	const itemsPerPage = Math.max(1, Number.parseInt(limit ?? "25", 10) || 25);
	const offset = (currentPage - 1) * itemsPerPage;

	const [{ books, totalCount }, categories] = await Promise.all([
		getShopBooks({
			search: q,
			categorySlug: category,
			limit: itemsPerPage,
			offset,
			minPrice: minPrice ? Number.parseFloat(minPrice) : undefined,
			maxPrice: maxPrice ? Number.parseFloat(maxPrice) : undefined,
		}),
		getStoreCategories(),
	]);

	return (
		<ShopView
			activeCategory={category}
			books={books}
			categories={categories}
			currentPage={currentPage}
			itemsPerPage={itemsPerPage}
			searchQuery={q}
			totalCount={totalCount}
		/>
	);
}
