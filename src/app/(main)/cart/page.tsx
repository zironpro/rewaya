import { CartView } from "@/features/cart/cart-view";
import { getVisitorWixClient } from "@/lib/wix/client";

export default async function CartPage() {
	const wixClient = await getVisitorWixClient();
	const cart = await wixClient.currentCart.getCurrentCart();

	console.log("Cart Items", cart);

	return <CartView />;
}
