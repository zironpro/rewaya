import { HomepageView } from "@/features/home/homepage-view";
import { getBundles } from "@/lib/wix/bundles";
import { getHomepageData } from "@/lib/wix/cms/homepage";

export const dynamic = "force-dynamic";

export default async function Home() {
	const [{ sections, banners, categories }, bundles] = await Promise.all([
		getHomepageData(),
		getBundles(),
	]);

	return (
		<HomepageView
			banners={banners}
			bundles={bundles}
			categories={categories}
			sections={sections}
		/>
	);
}
