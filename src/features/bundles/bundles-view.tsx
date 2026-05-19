import Breadcrumbs from "@/components/layout/Breadcrumbs";

import { BundleCard } from "@/features/bundles/components/bundle-card";
import { bundles } from "@/lib/bundles-data";

import { BundlesFilter } from "./components/bundles-filter";
import { BundlesSortSelect } from "./components/bundles-sort-select";

export const BundlesView = () => {
	return (
		<main className="min-h-screen grow pt-4">
			<section className="container mx-auto mb-12">
				<Breadcrumbs className="mb-8" items={[{ label: "Bundles" }]} />
				<div className="text-center">
					<span className="mb-6 block font-bold text-primary text-sm">
						Curated Collections
					</span>
					<h1 className="mb-8 font-bold font-serif text-5xl text-primary md:text-7xl">
						The{" "}
						<span className="font-normal text-secondary italic">Bundles.</span>
					</h1>
				</div>
			</section>

			{/* Main Content Area */}
			<section className="container mx-auto mb-32">
				<div className="flex flex-col gap-16 lg:flex-row">
					{/* Sidebar Filters (Desktop Only) */}
					<aside className="scrollbar-thin sticky top-32 hidden h-fit max-h-[calc(100vh-160px)] w-64 shrink-0 space-y-12 overflow-y-auto pr-4 lg:block">
						<BundlesFilter />
					</aside>

					{/* Product Grid Area */}
					<div className="grow">
						<div className="mb-12 hidden items-center justify-between border-stone-100 border-b pb-4 lg:flex">
							<p className="font-bold text-primary text-sm">
								Showing {bundles.length} Curations
							</p>
							<div className="flex items-center gap-6">
								<span className="shrink-0 font-bold text-sm text-stone-400">
									Sort by:
								</span>
								<BundlesSortSelect />
							</div>
						</div>

						<div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
							{bundles.map((bundle) => (
								<BundleCard key={bundle.id} {...bundle} />
							))}
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};
