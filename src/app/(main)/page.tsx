import { HomepageView } from "@/features/home/homepage-view";
import { getShopBooks } from "@/lib/wix/products";

export const dynamic = "force-dynamic";

export default async function Home() {
	const books = await getShopBooks();
	return <HomepageView books={books} />;
}
