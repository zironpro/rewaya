import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export default function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Navbar />
			{children}
			<MobileBottomNav />
			<Footer />
		</>
	);
}
