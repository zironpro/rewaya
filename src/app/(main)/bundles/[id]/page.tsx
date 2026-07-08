import { notFound } from "next/navigation";

import { BundleDetailView } from "@/features/bundles/bundle-detail-view";
import { getBundleBySlug, getBundlesIndex } from "@/lib/wix/bundles";
import { getShopBooks } from "@/lib/wix/products";
import { getBundleStaticParams } from "@/lib/wix/static-params";

export const revalidate = 60;

export async function generateStaticParams() {
	return getBundleStaticParams();
}

export default async function BundleDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const [bundle, allBundles, { books: relatedBooks }] = await Promise.all([
		getBundleBySlug(id),
		getBundlesIndex(),
		getShopBooks(),
	]);

	// const client = getWixClient();
	// const { items } = await client.items
	// 	.query(BOOK_BUNDLES_COLLECTION)
	// 	// .include("bundleProducts")
	// 	.limit(1)
	// 	.find();

	// console.log("items", items);

	if (!bundle) notFound();

	return (
		<>
			{/* <pre className="text-wrap px-6 text-xs">
				{JSON.stringify(items, null, 2)}
			</pre> */}
			<BundleDetailView
				allBundles={allBundles}
				bundle={bundle}
				id={id}
				relatedBooks={relatedBooks}
			/>
		</>
	);
}
