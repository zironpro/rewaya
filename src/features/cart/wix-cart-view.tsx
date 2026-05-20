"use client";

import { useCallback, useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";

import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { Button, buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useWixClient } from "@/lib/wix/provider";

interface CartLineItem {
	_id?: string | null;
	productName?: { translated?: string };
	quantity?: number;
	price?: { formattedConvertedAmount?: string };
	image?: string;
	url?: string | { relativePath?: string; url?: string };
}

interface CartSnapshot {
	_id?: string | null;
	lineItems?: CartLineItem[];
	subtotal?: {
		formattedConvertedAmount?: string;
		amount?: string;
	};
}

/** Wix SDK typings omit expanded cart fields present at runtime. */
function asCartSnapshot(cart: unknown): CartSnapshot {
	return cart as CartSnapshot;
}

function resolveCartImage(image: string | undefined): string | undefined {
	if (!image) return undefined;
	if (image.startsWith("wix:image://")) {
		const match = image.match(/wix:image:\/\/v1\/([^/]+)/);
		if (match) {
			return `https://static.wixstatic.com/media/${match[1]}/v1/fill/w_200,h_280,al_c,q_80/${match[1]}`;
		}
	}
	return image;
}

function resolveProductHref(item: CartLineItem): string | undefined {
	const url = item.url;
	if (!url) return undefined;
	const str = typeof url === "string" ? url : (url.relativePath ?? url.url);
	if (!str) return undefined;
	const match = str.match(/\/product-page\/([^/?#]+)/);
	return match ? `/product/${match[1]}` : undefined;
}

export function WixCartView() {
	const wixClient = useWixClient();
	const [lineItems, setLineItems] = useState<CartLineItem[]>([]);
	const [subtotal, setSubtotal] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [checkoutLoading, setCheckoutLoading] = useState(false);

	const refreshCart = useCallback(async () => {
		if (!wixClient) {
			setLoading(false);
			return;
		}

		try {
			const cart = asCartSnapshot(await wixClient.currentCart.getCurrentCart());
			setLineItems((cart?.lineItems as CartLineItem[]) ?? []);
			setSubtotal(
				cart?.subtotal?.formattedConvertedAmount ??
					cart?.subtotal?.amount ??
					null
			);
		} catch {
			setLineItems([]);
			setSubtotal(null);
		} finally {
			setLoading(false);
		}
	}, [wixClient]);

	useEffect(() => {
		refreshCart();
		const onUpdate = () => refreshCart();
		window.addEventListener("cart-updated", onUpdate);
		return () => window.removeEventListener("cart-updated", onUpdate);
	}, [refreshCart]);

	const updateQuantity = async (lineItemId: string, quantity: number) => {
		if (!wixClient || quantity < 1) return;
		await wixClient.currentCart.updateCurrentCartLineItemQuantity([
			{ _id: lineItemId, quantity },
		]);
		window.dispatchEvent(new CustomEvent("cart-updated"));
	};

	const removeItem = async (lineItemId: string) => {
		if (!wixClient) return;
		await wixClient.currentCart.removeLineItemsFromCurrentCart([lineItemId]);
		window.dispatchEvent(new CustomEvent("cart-updated"));
	};

	const handleCheckout = async () => {
		if (!wixClient) return;
		setCheckoutLoading(true);
		try {
			const cart = asCartSnapshot(await wixClient.currentCart.getCurrentCart());
			if (!cart?._id) return;

			const redirect = await wixClient.redirects.createRedirectSession({
				ecomCheckout: { checkoutId: cart._id },
				callbacks: {
					postFlowUrl: `${window.location.origin}/cart`,
				},
			});

			if (redirect.redirectSession?.fullUrl) {
				window.location.href = redirect.redirectSession.fullUrl;
			}
		} finally {
			setCheckoutLoading(false);
		}
	};

	if (!wixClient) {
		return (
			<main className="grow pt-20 pb-28 md:pb-16">
				<div className="container py-32 text-center">
					<p className="text-stone-500">
						Configure <code className="text-sm">NEXT_PUBLIC_WIX_CLIENT_ID</code>{" "}
						to enable checkout.
					</p>
				</div>
			</main>
		);
	}

	return (
		<main className="grow pt-20 pb-28 md:pb-16">
			<div className="container">
				<Breadcrumbs className="mb-8" items={[{ label: "Shopping Bag" }]} />
				<div className="mb-16">
					<span className="mb-4 block font-bold text-sm text-stone-400">
						Your Selection
					</span>
					<h1 className="font-black font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
						Shopping <span className="font-normal italic">Bag</span>.
					</h1>
				</div>

				{loading ? (
					<p className="py-32 text-center text-stone-400">Loading cart…</p>
				) : lineItems.length === 0 ? (
					<div className="border-stone-100 border-y py-32 text-center">
						<p className="mb-8 text-sm text-stone-400">
							Your bag is currently empty.
						</p>
						<Link
							className={cn(
								buttonVariants({ variant: "premium", size: "lg" }),
								"inline-flex no-underline hover:no-underline"
							)}
							href="/shop"
						>
							Continue Shopping
						</Link>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
						<div className="space-y-8 lg:col-span-8">
							<AnimatePresence mode="popLayout">
								{lineItems.map((item) => {
									const imageUrl = resolveCartImage(item.image);
									const href = resolveProductHref(item);
									const lineId = item._id ?? "";

									return (
										<motion.div
											className="flex gap-6 border-stone-100 border-b pb-8"
											exit={{ opacity: 0, x: -20 }}
											key={lineId}
											layout
										>
											<div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg bg-stone-50">
												{imageUrl && (
													<Image
														alt={item.productName?.translated ?? "Product"}
														className="object-cover"
														fill
														sizes="96px"
														src={imageUrl}
													/>
												)}
											</div>
											<div className="flex grow flex-col justify-between">
												<div>
													{href ? (
														<Link
															className="font-bold text-lg text-primary hover:underline"
															href={href}
														>
															{item.productName?.translated}
														</Link>
													) : (
														<h3 className="font-bold text-lg text-primary">
															{item.productName?.translated}
														</h3>
													)}
													<p className="mt-1 font-medium text-secondary">
														{item.price?.formattedConvertedAmount}
													</p>
												</div>
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-4 border border-stone-100 px-3 py-1">
														<button
															className="text-stone-400 hover:text-primary"
															onClick={() =>
																updateQuantity(lineId, (item.quantity ?? 1) - 1)
															}
															type="button"
														>
															<Minus size={14} />
														</button>
														<span className="font-bold text-sm">
															{item.quantity}
														</span>
														<button
															className="text-stone-400 hover:text-primary"
															onClick={() =>
																updateQuantity(lineId, (item.quantity ?? 1) + 1)
															}
															type="button"
														>
															<Plus size={14} />
														</button>
													</div>
													<button
														className="text-stone-300 transition-colors hover:text-red-500"
														onClick={() => removeItem(lineId)}
														type="button"
													>
														<Trash2 size={18} />
													</button>
												</div>
											</div>
										</motion.div>
									);
								})}
							</AnimatePresence>
						</div>

						<div className="lg:col-span-4">
							<div className="sticky top-32 space-y-8 rounded-xl border bg-stone-50/50 p-8">
								<h3 className="font-bold text-xl">Order Summary</h3>
								<div className="space-y-4 border-stone-200 border-b pb-6">
									<div className="flex justify-between text-sm">
										<span className="text-stone-500">Subtotal</span>
										<span className="font-bold">{subtotal ?? "—"}</span>
									</div>
								</div>
								<Button
									className="h-14 w-full gap-2"
									disabled={checkoutLoading}
									onClick={handleCheckout}
									variant="premium"
								>
									{checkoutLoading ? "Redirecting…" : "Proceed to Checkout"}
									<ArrowRight size={18} />
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
