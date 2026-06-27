import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { MobileBottomNav } from "@/components/MobileBottomNav";

import { getStoreCategories } from "@/lib/wix/categories";

export default async function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const categories = await getStoreCategories();

	return (
		<>
			<Navbar categories={categories} />
			{children}
			<MobileBottomNav />
			<Footer />
		</>
	);
}
