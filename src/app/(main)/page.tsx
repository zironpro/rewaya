import { HomepageView } from "@/features/home/homepage-view";
import { getBundles } from "@/lib/wix/bundles";
import { getStoreCategories } from "@/lib/wix/categories";
import { getShopBooks } from "@/lib/wix/products";

export const dynamic = "force-dynamic";

export default async function Home() {
	const [books, bundles, categories] = await Promise.all([
		getShopBooks({ limit: 48 }),
		getBundles(),
		getStoreCategories(),
	]);

	return (
		<HomepageView books={books} bundles={bundles} categories={categories} />
	);
}
