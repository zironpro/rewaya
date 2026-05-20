import type { Metadata } from "next";
import "@/styles/globals.css";

import { TooltipProvider } from "@/components/ui/tooltip";

import { inter, playfair } from "@/assets/fonts";

import { cn } from "@/lib/utils";
import { WixProvider } from "@/lib/wix/provider";

export const metadata: Metadata = {
	title: "Al Rewaya Book World | Your Premier Islamic Bookstore",
	description:
		"Discover a curated collection of Islamic literature, academic texts, and classic books at Rewaya Book World.",
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
			lang="en"
		>
			<body>
				<WixProvider>
					<TooltipProvider delay={0}>{children}</TooltipProvider>
				</WixProvider>
			</body>
		</html>
	);
}
