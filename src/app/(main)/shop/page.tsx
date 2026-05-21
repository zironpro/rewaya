import { ShopView } from "@/features/shop/shop-view";
import { getStoreCategories } from "@/lib/wix/categories";
import { getShopBooks } from "@/lib/wix/products";

export const dynamic = "force-dynamic";

export default async function ShopPage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; category?: string }>;
}) {
	const { q, category } = await searchParams;

	const [books, categories] = await Promise.all([
		getShopBooks({ search: q, categorySlug: category }),
		getStoreCategories(),
	]);

	return (
		<ShopView
			activeCategory={category}
			books={books}
			categories={categories}
			searchQuery={q}
		/>
	);
}
