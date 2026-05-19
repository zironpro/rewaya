"use client";

import { useMemo } from "react";

import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { Separator } from "@/components/ui/separator";

import { BundleBuyBox } from "@/features/bundles/components/bundle-detail/bundle-buy-box";
import { BundleImageGallery } from "@/features/bundles/components/bundle-detail/bundle-image-gallery";
import { BundleIncludedVolumes } from "@/features/bundles/components/bundle-detail/bundle-included-volumes";
import { BundleNewsletterCta } from "@/features/bundles/components/bundle-detail/bundle-newsletter-cta";
import { BundleProductInfo } from "@/features/bundles/components/bundle-detail/bundle-product-info";
import { BundleRelatedBooks } from "@/features/bundles/components/bundle-detail/bundle-related-books";
import { BundleRelatedBundles } from "@/features/bundles/components/bundle-detail/bundle-related-bundles";
import { allBooks } from "@/features/products/data/products";
import { bundles } from "@/lib/bundles-data";
import type { BookProps } from "@/lib/store";

function pickRandomBooks(books: BookProps[], count: number, seed: string): BookProps[] {
	const shuffled = [...books].sort((a, b) => {
		const hash = (id: number) =>
			(seed + id)
				.split("")
				.reduce((acc, char) => acc + char.charCodeAt(0), 0);
		return (hash(a.id) % 10) - (hash(b.id) % 10);
	});
	return shuffled.slice(0, count);
}

interface BundleDetailViewProps {
	id: string;
}

export const BundleDetailView = ({ id }: BundleDetailViewProps) => {
	const bundle = bundles.find((b) => b.id === id) ?? bundles[0];
	const relatedBundles = bundles.filter((b) => b.id !== bundle.id);
	const randomBooks = useMemo(
		() => pickRandomBooks(allBooks, 4, bundle.id),
		[bundle.id]
	);

	return (
		<main className="min-h-screen pt-6 font-sans text-secondary">
			<div className="container mx-auto px-4 md:px-8">
				<Breadcrumbs
					className="mb-8"
					items={[
						{ label: "Shop", href: "/shop" },
						{ label: "Bundles", href: "/bundles" },
						{ label: bundle.title },
					]}
				/>

				<div className="mb-20 grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
					<div className="lg:col-span-5">
						<BundleImageGallery bundle={bundle} />
					</div>

					<BundleProductInfo bundle={bundle} className="lg:col-span-4" />
					<BundleBuyBox bundle={bundle} className="lg:col-span-3" />
				</div>
				<BundleIncludedVolumes books={bundle.books} />
				<Separator />
				<BundleRelatedBundles bundles={relatedBundles} />
				<BundleRelatedBooks books={randomBooks} />
				<BundleNewsletterCta />
			</div>
		</main>
	);
};
