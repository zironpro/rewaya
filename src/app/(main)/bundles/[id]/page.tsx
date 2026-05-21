import { BundleDetailView } from "@/features/bundles/bundle-detail-view";
import { getBundleBySlug, getBundles } from "@/lib/wix/bundles";
import { getShopBooks } from "@/lib/wix/products";
import { getBundleStaticParams } from "@/lib/wix/static-params";

export const revalidate = 86_400;

export async function generateStaticParams() {
	return getBundleStaticParams();
}

export default async function BundleDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const [bundle, allBundles, relatedBooks] = await Promise.all([
		getBundleBySlug(id),
		getBundles(),
		getShopBooks(),
	]);

	return (
		<BundleDetailView
			allBundles={allBundles}
			bundle={bundle}
			id={id}
			relatedBooks={relatedBooks}
		/>
	);
}
