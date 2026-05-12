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
  title: "Rewaya Books | Modern Arabic & International Bookstore",
  description: "Curated collection of Islamic, Self-Help, and Fiction books. Experience the future of reading with Rewaya.",
};

import LoadingScreen from "@/components/LoadingScreen";
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
        <div className="flex-grow pb-16 md:pb-0">
          {children}
        </div>
        <MobileBottomNav />
      </body>
    </html>
  );
}
