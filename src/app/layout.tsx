import type { Metadata } from "next";
import "@/styles/globals.css";

import { TooltipProvider } from "@/components/ui/tooltip";

import { inter, playfair } from "@/assets/fonts";

import { CartProvider } from "@/features/cart/cart-provider";
import { WishlistProvider } from "@/features/wishlist/wishlist-provider";
import { cn } from "@/lib/utils";
import { WixProvider } from "@/lib/wix/provider";

export const metadata: Metadata = {
	title: "Al Rewaya Book World | Your Premier Islamic Bookstore",
	description:
		"Discover a curated collection of Islamic literature, academic texts, and classic books at Rewaya Book World.",

	other: {
		"facebook-domain-verification": "40qw6zil0ubg6k26nl0ku20oy70djy",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			className={cn(
				"scroll-smooth antialiased",
				playfair.variable,
				"font-sans",
				inter.variable
			)}
			data-scroll-behavior="smooth"
			lang="en"
		>
			<body>
				<WixProvider>
					<CartProvider>
						<WishlistProvider>
							<TooltipProvider delay={0}>{children}</TooltipProvider>
						</WishlistProvider>
					</CartProvider>
				</WixProvider>
			</body>
		</html>
	);
}
