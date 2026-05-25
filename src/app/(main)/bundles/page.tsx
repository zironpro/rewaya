import { BundlesView } from "@/features/bundles/bundles-view";
import { getBundlesIndex } from "@/lib/wix/bundles";

export const dynamic = "force-dynamic";

export default async function BundlesPage() {
	const bundles = await getBundlesIndex();
	return <BundlesView bundles={bundles} />;
}
