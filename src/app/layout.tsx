import type { Metadata } from "next";
import "./globals.css";

import AuthModal from "@/components/AuthModal";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";

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
				inter.variable,
				playfair.variable
			)}
			lang="en"
		>
			<body className="flex min-h-full flex-col font-sans">
				{/* <LoadingScreen /> */}
				<Navbar />
				<AuthModal />
				{children}
				<MobileBottomNav />
				<Footer />
			</body>
		</html>
	);
}
