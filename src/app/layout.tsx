import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Al Rewaya Book World | Your Premier Islamic Bookstore",
  description: "Discover a curated collection of Islamic literature, academic texts, and classic books at Rewaya Book World.",
};

import LoadingScreen from "@/components/LoadingScreen";
import AuthModal from "@/components/AuthModal";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <LoadingScreen />
        <AuthModal />
        <div className="flex-grow pb-16 md:pb-0">
          {children}
        </div>
        <MobileBottomNav />
      </body>
    </html>
  );
}
