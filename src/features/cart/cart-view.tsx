"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
	CART_UPDATED_EVENT,
	dispatchCartUpdated,
} from "@/components/commerce/cart-events";
import { StatusBanner } from "@/components/feedback/status-banner";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

import { useOpenPanel } from "@openpanel/nextjs";

import { fetchCart, removeItem, updateItemQuantity, redirectToCheckout } from "@/features/cart/cart-actions";
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
import { trackMetaEvent } from "@/lib/analytics/meta";

export function CartView() {
	const { track } = useOpenPanel();
	const router = useRouter();
	const initialCacheRef = useRef(
		typeof window !== "undefined" ? readCartSnapshot() : null
	);
	const initialCache = initialCacheRef.current;

	const [items, setItems] = useState<LineItem[]>(initialCache?.lineItems ?? []);
	const [summary, setSummary] = useState<CartSummary>(
		initialCache?.summary ?? { discountNames: [] }
	);
	const [loading, setLoading] = useState(!initialCache);
	const [actionError, setActionError] = useState<string | null>(null);
	const [checkingOut, startCheckout] = useTransition();
	const qtyTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

	const applyCart = useCallback((cart: unknown) => {
		const { lineItems, summary: nextSummary } = syncCartFromWixResponse(cart);
		setItems(lineItems);
		setSummary(nextSummary);
	}, []);

	const loadCart = useCallback(async () => {
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
		window.addEventListener(CART_UPDATED_EVENT, onUpdate);
		return () => window.removeEventListener(CART_UPDATED_EVENT, onUpdate);
	}, [loadCart]);

	const handleUpdateQuantity = (itemId: string, quantity: number) => {
		if (quantity < 1) return;

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
						setActionError(
							error ?? "Could not update quantity. Please try again."
						);
						await loadCart();
						return;
					}
					setActionError(null);
					applyCart(cart);
					dispatchCartUpdated(cart);
				} catch {
					setActionError("Could not update quantity. Please try again.");
					await loadCart();
				}
			}, 300)
		);
	};

	const handleRemoveItem = async (itemId: string) => {
		setItems((prev) => prev.filter((it) => it._id !== itemId));

		try {
			const { cart, error } = await removeItem(null, itemId);
			if (error || !cart) {
				setActionError(error ?? "Could not remove item. Please try again.");
				await loadCart();
				return;
			}
			setActionError(null);
			applyCart(cart);
			dispatchCartUpdated(cart);
		} catch {
			setActionError("Could not remove item. Please try again.");
			await loadCart();
		}
	};

	const handleCheckout = () => {
		// Track InitiateCheckout event
		if (typeof window !== "undefined") {
			trackMetaEvent("InitiateCheckout", {
				event_source_url: window.location.href,
				custom_data: {
					value: Number(summary.total) ?? Number(summary.subtotal),
					currency: "AED",
					num_items: items.length,
				},
			});
		}
		track("checkout", {
			value: Number(summary.total) ?? Number(summary.subtotal),
			num_items: items.length,
		});
		// Redirect to Wix-hosted checkout
		startCheckout(() => redirectToCheckout());
	};

	const hasUnavailable = items.some(isItemUnavailable);
	const displayTotal = summary.total ?? summary.subtotal;

	return (
		<main className="grow pt-4 pb-28 md:pb-16">
			<div className="container">
				<Breadcrumbs className="mb-4" items={[{ label: "Shopping Bag" }]} />

				{actionError ? (
					<StatusBanner className="mb-6" variant="error">
						{actionError}
					</StatusBanner>
				) : null}
				<div className="mb-12">
					<h1 className="font-bold font-serif text-3xl text-secondary sm:text-4xl md:text-5xl">
						Shopping <span className="font-normal italic">Bag</span>.
					</h1>
				</div>

				{loading ? (
					<CartLoading />
				) : items.length === 0 ? (
					<CartEmpty />
				) : (
					<div className="flex flex-col gap-12 lg:flex-row">
						<div className="grow space-y-4">
							<div className="hidden grid-cols-4 border-stone-100 border-b pb-4 font-bold text-sm text-stone-400 md:grid">
								<div className="col-span-2">Item</div>
								<div className="text-center">Quantity</div>
								<div className="text-right">Total</div>
							</div>

							{items.map((item) => (
								<CartLineItem
									item={item}
									key={item._id ?? ""}
									onRemove={handleRemoveItem}
									onUpdateQuantity={handleUpdateQuantity}
								/>
							))}
						</div>
						<aside className="w-full lg:w-96">
							<CartOrderSummary
								checkingOut={checkingOut}
								displayTotal={displayTotal}
								hasUnavailable={hasUnavailable}
								onCheckout={handleCheckout}
								summary={summary}
							/>
						</aside>
					</div>
				)}
			</div>
		</main>
	);
}
