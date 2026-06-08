"use client";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";

import { useStorefrontMutation } from "@/lib/shopify";
import { CREATE_CHECKOUT_URL } from "@/qraphql/storefront/checkout";
import { CartCreateMutation } from "@/types/shopify-storefront-graphql";

interface CheckoutButtonProps extends React.ComponentProps<typeof Button> {
	children: React.ReactNode;
	productVariantId?: string | null;
}

export const CheckoutButton = ({
	children,
	productVariantId,
	...props
}: CheckoutButtonProps) => {
	const [isPending, startTransition] = useTransition();

	const mutation = useStorefrontMutation<CartCreateMutation>();

	const variantId = productVariantId;

	function handleCheckout() {
		if (!variantId) return;

		startTransition(async () => {
			const res = await mutation.mutate({
				query: CREATE_CHECKOUT_URL,
				variables: {
					variantId,
				},
			});
			if (res.cartCreate?.cart) {
				window.location.href = res.cartCreate.cart.checkoutUrl as string;
			}
		});
	}

	return (
		<Button disabled={isPending} onClick={handleCheckout} {...props}>
			{children}
		</Button>
	);
};
