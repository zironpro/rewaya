import type { Metadata } from "next";
import "./globals.css";

import { inter, playfair } from "@/assets/fonts";

import { cn } from "@/lib/utils";

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
			<body className="flex min-h-full flex-col">{children}</body>
		</html>
	);
}
