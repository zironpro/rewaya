import { HomepageView } from "@/features/home/homepage-view";
import { getBundles } from "@/lib/wix/bundles";
import { getShopBooks } from "@/lib/wix/products";

export const dynamic = "force-dynamic";

export default async function Home() {
	const [books, bundles] = await Promise.all([getShopBooks(), getBundles()]);

	return <HomepageView books={books} bundles={bundles} />;
}
