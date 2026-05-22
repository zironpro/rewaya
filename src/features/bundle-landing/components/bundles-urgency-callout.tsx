import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { BundlesCampaignActions } from "./bundles-campaign-actions";

interface BundlesUrgencyCalloutProps {
	featuredSlug: string;
}

export function BundlesUrgencyCallout({ featuredSlug }: BundlesUrgencyCalloutProps) {
	return (
		<section className="container py-8 md:py-10">
			<Card className="border-warning/30 bg-warning/5">
				<CardContent className="flex flex-col items-center gap-4 p-6 text-center md:flex-row md:justify-between md:text-left">
					<div className="space-y-2">
						<p className="font-semibold text-secondary">
							Buy soon — bundle pricing is limited while the timer runs
						</p>
						<BundlesCampaignActions
							featuredSlug={featuredSlug}
							variant="countdown-compact"
						/>
					</div>
					<Button
						className="campaign-shimmer shrink-0"
						nativeButton={false}
						render={<Link href="#bundles" />}
						size="lg"
					>
						Buy the bundle now
					</Button>
				</CardContent>
			</Card>
		</section>
	);
}
