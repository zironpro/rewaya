import { BundlesView } from "@/features/bundles/bundles-view";
import { getBundles } from "@/lib/wix/bundles";

export const dynamic = "force-dynamic";

export default async function BundlesPage() {
	const bundles = await getBundles();
	return <BundlesView bundles={bundles} />;
}
