import { ShopView } from "@/features/shop/shop-view";
import { getShopBooks } from "@/lib/wix/products";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
	const books = await getShopBooks();
	return <ShopView books={books} />;
}
