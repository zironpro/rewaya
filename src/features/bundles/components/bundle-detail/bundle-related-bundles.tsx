import { BundleCard } from "@/features/bundles/components/bundle-card";
import type { Bundle } from "@/lib/bundles-data";

import { BundleSectionHeading } from "./bundle-section-heading";

interface BundleRelatedBundlesProps {
	bundles: Bundle[];
}

export function BundleRelatedBundles({ bundles }: BundleRelatedBundlesProps) {
	if (bundles.length === 0) return null;

	return (
		<section className="mt-12 border-stone-100 border-t pt-12">
			<div className="mb-12 flex items-end justify-between">
				<BundleSectionHeading
					eyebrow="Continue exploring"
					highlight="collections"
					title="Related"
				/>
			</div>

			<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
				{bundles.slice(0, 4).map((bundle) => (
					<BundleCard key={bundle.id} {...bundle} />
				))}
			</div>
		</section>
	);
}
