import { Lock, Package, Truck } from "lucide-react";

const TRUST_ITEMS = [
	{
		icon: Truck,
		title: "UAE delivery",
		description: "Standard delivery windows at checkout",
	},
	{
		icon: Package,
		title: "Curated sets",
		description: "Hand-picked titles that read well together",
	},
	{
		icon: Lock,
		title: "Secure checkout",
		description: "Same trusted Rewaya cart and payment",
	},
] as const;

export function BundlesIndexTrust() {
	return (
		<section className="container py-10 md:py-14">
			<div className="grid gap-6 sm:grid-cols-3">
				{TRUST_ITEMS.map(({ icon: Icon, title, description }) => (
					<div
						className="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center"
						key={title}
					>
						<div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
							<Icon className="size-5" />
						</div>
						<h3 className="mt-4 font-semibold text-secondary">{title}</h3>
						<p className="mt-1 text-muted-foreground text-sm">{description}</p>
					</div>
				))}
			</div>
		</section>
	);
}
