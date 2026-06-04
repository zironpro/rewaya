"use server";

import { redirectToCheckout } from "@/features/cart/cart-actions";

export default async function CheckoutPage() {
await redirectToCheckout();
return null;
}
