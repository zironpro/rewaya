import Link from "next/link";

import { Button } from "@/components/ui/button";

export default async function ThankYouPage({
	searchParams,
}: {
	searchParams: Promise<{ orderId?: string }>;
}) {
	const { orderId } = await searchParams;

	return (
		<main className="container grow py-24 text-center">
			<h1 className="font-serif text-4xl text-secondary">Thank you</h1>
			<p className="mx-auto mt-4 max-w-md text-muted-foreground">
				Your order has been received. We appreciate your trust in Rewaya Books.
			</p>
			{orderId ? (
				<p className="mt-6 font-medium text-secondary text-sm">
					Order reference: <span className="text-primary">{orderId}</span>
				</p>
			) : null}
			<div className="mt-10 flex flex-wrap justify-center gap-4">
				<Button nativeButton={false} render={<Link href="/shop" />}>
					Continue shopping
				</Button>
				<Button
					nativeButton={false}
					render={<Link href="/profile/orders" />}
					variant="outline"
				>
					View orders
				</Button>
			</div>
		</main>
	);
}
