"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";

import { AnimatePresence } from "framer-motion";

import Breadcrumbs from "@/components/layout/Breadcrumbs";

import {
	fetchCart,
	redirectToCheckout,
	removeItem,
	updateItemQuantity,
} from "@/features/cart/cart-actions";
import {
	type CartSummary,
	isItemUnavailable,
	type LineItem,
	readCartSnapshot,
	syncCartFromWixResponse,
} from "@/features/cart/cart-sdk";
import { CartEmpty } from "@/features/cart/components/cart-empty";
import { CartLineItem } from "@/features/cart/components/cart-line-item";
import { CartLoading } from "@/features/cart/components/cart-loading";
import { CartOrderSummary } from "@/features/cart/components/cart-order-summary";
import { DeliveryNoticeBanner } from "@/features/cart/components/delivery-notice-banner";

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
					<CartLoading />
				) : items.length === 0 ? (
					<CartEmpty />
				) : (
					<div className="flex flex-col gap-20 lg:flex-row">
						<aside className="order-2 w-full lg:order-0 lg:w-96">
							<CartOrderSummary
								checkingOut={checkingOut}
								displayTotal={displayTotal}
								hasUnavailable={hasUnavailable}
								onCheckout={handleCheckout}
								summary={summary}
							/>
						</aside>

						<div className="order-1 grow space-y-8">
							<div className="hidden grid-cols-4 border-stone-100 border-b pb-6 font-bold text-sm text-stone-400 md:grid">
								<div className="col-span-2">Product</div>
								<div className="text-center">Quantity</div>
								<div className="text-right">Total</div>
							</div>

							<AnimatePresence mode="popLayout">
								{items.map((item) => (
									<CartLineItem
										item={item}
										key={item._id ?? ""}
										onRemove={handleRemoveItem}
										onUpdateQuantity={handleUpdateQuantity}
									/>
								))}
							</AnimatePresence>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
