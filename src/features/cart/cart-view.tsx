"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";

import Image from "next/image";
import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";

import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";

import {
	fetchCart,
	redirectToCheckout,
	removeItem,
	updateItemQuantity,
} from "@/features/cart/cart-actions";
import {
	type CartSummary,
	firstDescriptionSubtitle,
	isItemUnavailable,
	type LineItem,
	readCartSnapshot,
	resolveCartImage,
	resolveProductHref,
	syncCartFromWixResponse,
} from "@/features/cart/cart-sdk";
import { DeliveryNoticeBanner } from "@/features/cart/components/delivery-notice-banner";
import { cn } from "@/lib/utils";

function dispatchCartUpdated(cart?: unknown) {
	window.dispatchEvent(
		new CustomEvent("cart-updated", { detail: cart ? { cart } : undefined })
	);
}

const cartEnabled = Boolean(process.env.NEXT_PUBLIC_WIX_CLIENT_ID);

export function CartView() {
	const initialCacheRef = useRef(
		typeof window !== "undefined" ? readCartSnapshot() : null
	);
	const initialCache = initialCacheRef.current;

	const [items, setItems] = useState<LineItem[]>(initialCache?.lineItems ?? []);
	const [summary, setSummary] = useState<CartSummary>(
		initialCache?.summary ?? { discountNames: [] }
	);
	const [loading, setLoading] = useState(!initialCache);
	const [checkingOut, startCheckout] = useTransition();
	const qtyTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

	const applyCart = useCallback((cart: unknown) => {
		const { lineItems, summary: nextSummary } = syncCartFromWixResponse(cart);
		setItems(lineItems);
		setSummary(nextSummary);
	}, []);

	const loadCart = useCallback(async () => {
		if (!cartEnabled) {
			setLoading(false);
			return;
		}

		try {
			const cart = await fetchCart();
			if (cart) {
				applyCart(cart);
			} else if (!initialCacheRef.current) {
				setItems([]);
				setSummary({ discountNames: [] });
			}
		} catch {
			if (!initialCacheRef.current) {
				setItems([]);
				setSummary({ discountNames: [] });
			}
		} finally {
			setLoading(false);
		}
	}, [applyCart]);

	useEffect(() => {
		loadCart();
		const onUpdate = () => loadCart();
		window.addEventListener("cart-updated", onUpdate);
		return () => window.removeEventListener("cart-updated", onUpdate);
	}, [loadCart]);

	const handleUpdateQuantity = (itemId: string, quantity: number) => {
		if (!cartEnabled || quantity < 1) return;

		setItems((prev) =>
			prev.map((it) => (it._id === itemId ? { ...it, quantity } : it))
		);

		const prev = qtyTimers.current.get(itemId);
		if (prev) clearTimeout(prev);
		qtyTimers.current.set(
			itemId,
			setTimeout(async () => {
				qtyTimers.current.delete(itemId);
				try {
					const { cart, error } = await updateItemQuantity(null, {
						lineId: itemId,
						quantity,
					});
					if (error || !cart) {
						await loadCart();
						return;
					}
					applyCart(cart);
					dispatchCartUpdated(cart);
				} catch {
					await loadCart();
				}
			}, 300)
		);
	};

	const handleRemoveItem = async (itemId: string) => {
		if (!cartEnabled) return;

		setItems((prev) => prev.filter((it) => it._id !== itemId));

		try {
			const { cart, error } = await removeItem(null, itemId);
			if (error || !cart) {
				await loadCart();
				return;
			}
			applyCart(cart);
			dispatchCartUpdated(cart);
		} catch {
			await loadCart();
		}
	};

	const handleCheckout = () => {
		if (!cartEnabled) return;
		startCheckout(() => redirectToCheckout());
	};

	const hasUnavailable = items.some(isItemUnavailable);
	const displayTotal = summary.total ?? summary.subtotal;

	if (!cartEnabled) {
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
		<main className="grow pt-4 pb-28 md:pb-16">
			<div className="container">
				<Breadcrumbs className="mb-8" items={[{ label: "Shopping Bag" }]} />
				<DeliveryNoticeBanner />
				<div className="mb-16">
					<span className="mb-4 block font-medium text-sm text-stone-400">
						Your Selection
					</span>
					<h1 className="font-black font-serif text-3xl text-secondary sm:text-4xl md:text-5xl lg:text-6xl">
						Shopping <span className="font-normal italic">Bag</span>.
					</h1>
				</div>

				{loading ? (
					<p className="border-stone-100 border-y py-20 text-center text-sm text-stone-400">
						Loading your bag…
					</p>
				) : items.length === 0 ? (
					<div className="border-stone-100 border-y py-20 text-center">
						<p className="mb-8 text-sm text-stone-400">
							Your bag is currently empty.
						</p>

						<Button nativeButton={false} render={<Link href="/shop" />}>
							Explore the Library
						</Button>
					</div>
				) : (
					<div className="flex flex-col gap-20 lg:flex-row">
						<div className="order-1 grow space-y-8">
							<div className="hidden grid-cols-4 border-stone-100 border-b pb-6 font-bold text-sm text-stone-400 md:grid">
								<div className="col-span-2">Product</div>
								<div className="text-center">Quantity</div>
								<div className="text-right">Total</div>
							</div>

							<AnimatePresence mode="popLayout">
								{items.map((item) => {
									const lineId = item._id ?? "";
									const unavailable = isItemUnavailable(item);
									const maxQty = item.availability?.quantityAvailable ?? 99;
									const href = !unavailable
										? resolveProductHref(item)
										: undefined;
									const imageUrl = resolveCartImage(item.image, 200, 280);
									const subtitle = firstDescriptionSubtitle(item);
									const hasDiscount =
										item.fullPrice?.formattedConvertedAmount &&
										item.fullPrice.formattedConvertedAmount !==
											item.price?.formattedConvertedAmount;

									return (
										<motion.div
											animate={{ opacity: 1, y: 0 }}
											className={cn(
												"grid grid-cols-1 items-center gap-8 border-stone-50 border-b py-8 md:grid-cols-4",
												unavailable && "opacity-60"
											)}
											exit={{ opacity: 0, x: -20 }}
											initial={{ opacity: 0, y: 20 }}
											key={lineId}
											layout
										>
											<div className="col-span-2 flex gap-6">
												<div className="relative h-24 w-20 shrink-0 overflow-hidden bg-stone-50 sm:h-32 sm:w-24">
													{imageUrl ? (
														href ? (
															<Link className="block h-full w-full" href={href}>
																<Image
																	alt={
																		item.productName?.translated ?? "Product"
																	}
																	className="h-full w-full object-cover"
																	fill
																	sizes="96px"
																	src={imageUrl}
																/>
															</Link>
														) : (
															<Image
																alt={item.productName?.translated ?? "Product"}
																className="h-full w-full object-cover"
																fill
																sizes="96px"
																src={imageUrl}
															/>
														)
													) : null}
												</div>
												<div className="flex flex-col justify-center gap-1">
													{href ? (
														<Link
															className="font-bold text-secondary text-sm hover:text-primary hover:underline"
															href={href}
														>
															{item.productName?.translated}
														</Link>
													) : (
														<h3 className="font-bold text-secondary text-sm">
															{item.productName?.translated}
														</h3>
													)}
													{subtitle ? (
														<p className="text-sm text-stone-400">{subtitle}</p>
													) : null}
													{hasDiscount && (
														<p className="text-stone-400 text-xs line-through">
															{item.fullPrice?.formattedConvertedAmount}
														</p>
													)}
													{item.price?.formattedConvertedAmount && (
														<p className="text-sm text-stone-500">
															{item.price.formattedConvertedAmount} each
														</p>
													)}
													{unavailable ? (
														<p className="mt-2 font-medium text-red-600 text-xs">
															{item.availability?.status === "NOT_FOUND"
																? "This item is no longer available"
																: "Out of stock"}
														</p>
													) : (
														<button
															className="mt-2 flex w-fit items-center gap-2 font-bold text-sm text-stone-300 transition-colors hover:text-primary"
															onClick={() => lineId && handleRemoveItem(lineId)}
															type="button"
														>
															<Trash2 size={12} /> Remove
														</button>
													)}
												</div>
											</div>

											<div className="flex items-center justify-center">
												{unavailable ? (
													<span className="text-sm text-stone-400">—</span>
												) : (
													<div className="flex items-center rounded-sm border border-stone-100">
														<button
															className="p-2 transition-colors hover:bg-stone-50 disabled:opacity-40"
															disabled={!item.quantity || item.quantity <= 1}
															onClick={() =>
																lineId &&
																handleUpdateQuantity(
																	lineId,
																	(item.quantity ?? 1) - 1
																)
															}
															type="button"
														>
															<Minus size={12} />
														</button>
														<span className="w-10 text-center font-bold text-sm">
															{item.quantity}
														</span>
														<button
															className="p-2 transition-colors hover:bg-stone-50 disabled:opacity-40"
															disabled={(item.quantity ?? 0) >= maxQty}
															onClick={() =>
																lineId &&
																handleUpdateQuantity(
																	lineId,
																	(item.quantity ?? 1) + 1
																)
															}
															type="button"
														>
															<Plus size={12} />
														</button>
													</div>
												)}
											</div>

											<div className="text-right">
												<span className="font-bold text-primary text-sm">
													{item.lineItemPrice?.formattedConvertedAmount ??
														item.price?.formattedConvertedAmount ??
														"—"}
												</span>
											</div>
										</motion.div>
									);
								})}
							</AnimatePresence>
						</div>

						<aside className="order-2 w-full lg:order-0 lg:w-96">
							<div className="sticky top-32 bg-stone-50 p-8">
								<h3 className="mb-8 border-stone-200 border-b pb-4 font-bold text-sm">
									Order Summary
								</h3>
								<div className="mb-8 space-y-4">
									<div className="flex justify-between font-bold text-sm text-stone-500">
										<span>Subtotal</span>
										<span>{summary.subtotal ?? "—"}</span>
									</div>
									{summary.discount ? (
										<div className="flex justify-between font-bold text-sm text-stone-500">
											<span>
												Discount
												{summary.discountNames.length > 0 && (
													<span className="font-normal text-stone-400">
														{" "}
														· {summary.discountNames.join(", ")}
													</span>
												)}
											</span>
											<span>−{summary.discount}</span>
										</div>
									) : summary.discountNames.length > 0 ? (
										<div className="flex justify-between text-sm text-stone-500">
											<span>Applied discount</span>
											<span className="text-right text-stone-400">
												{summary.discountNames.join(", ")}
											</span>
										</div>
									) : null}
									<div className="flex justify-between font-bold text-sm text-stone-500">
										<span>Shipping</span>
										<span>Free</span>
									</div>
								</div>
								<div className="mb-10 flex items-end justify-between border-stone-200 border-t pt-6">
									<span className="font-bold text-sm">Total</span>
									<span className="font-black font-serif text-2xl text-primary">
										{displayTotal ?? "—"}
									</span>
								</div>
								{hasUnavailable && (
									<p className="mb-4 text-red-600 text-xs">
										Remove unavailable items before checking out.
									</p>
								)}
								<Button
									disabled={checkingOut || hasUnavailable}
									onClick={handleCheckout}
									variant="secondary"
								>
									{checkingOut ? "Redirecting…" : "Checkout"}
									<ArrowRight
										className="ml-2 transition-transform group-hover:translate-x-1"
										size={16}
									/>
								</Button>
							</div>
						</aside>
					</div>
				)}
			</div>
		</main>
	);
}
