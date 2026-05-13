import { BundleDetailView } from "@/features/bundles/bundle-detail-view";

export default async function BundleDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <BundleDetailView id={id} />;
}
