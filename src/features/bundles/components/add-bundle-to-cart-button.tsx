"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { addBundle } from "@/features/cart/cart-actions";
import { syncCartFromWixResponse } from "@/features/cart/cart-sdk";

interface AddBundleToCartButtonProps {
	checkoutCatalogItemId: string;
	checkoutCatalogAppId?: string;
	quantity?: number;
	disabled?: boolean;
	className?: string;
	size?: "default" | "sm" | "lg" | "icon";
	variant?: "default" | "secondary" | "outline" | "ghost";
	children?: React.ReactNode;
	onAdded?: () => void;
}

function dispatchCartUpdated(cart?: unknown) {
	window.dispatchEvent(
		new CustomEvent("cart-updated", { detail: cart ? { cart } : undefined })
	);
}

export function AddBundleToCartButton({
	checkoutCatalogItemId,
	checkoutCatalogAppId,
	quantity = 1,
	disabled,
	className,
	size = "lg",
	variant = "secondary",
	children,
	onAdded,
}: AddBundleToCartButtonProps) {
	const [status, setStatus] = useState<"idle" | "loading" | "added" | "error">(
		"idle"
	);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const canAdd = Boolean(checkoutCatalogItemId);

	const handleAddToCart = async () => {
		if (!canAdd) return;

		setStatus("loading");
		setErrorMessage(null);

		try {
			const { error, cart } = await addBundle(null, {
				catalogItemId: checkoutCatalogItemId,
				catalogAppId: checkoutCatalogAppId,
				quantity,
			});
			if (error) {
				setErrorMessage(error);
				setStatus("error");
				setTimeout(() => {
					setStatus("idle");
					setErrorMessage(null);
				}, 4000);
				return;
			}
			if (cart) {
				syncCartFromWixResponse(cart);
			}
			dispatchCartUpdated(cart);

			setStatus("added");
			onAdded?.();
			setTimeout(() => setStatus("idle"), 2000);
		} catch (e) {
			console.error("[cart] add bundle failed:", e);
			setErrorMessage("Could not add bundle to cart. Please try again.");
			setStatus("error");
			dispatchCartUpdated();
			setTimeout(() => {
				setStatus("idle");
				setErrorMessage(null);
			}, 4000);
		}
	};

	const label =
		status === "loading"
			? "Adding…"
			: status === "added"
				? "Added ✓"
				: status === "error"
					? "Try again"
					: (children ?? "Add to Cart");

	return (
		<div className="flex w-full flex-col gap-1">
			<Button
				className={className}
				disabled={disabled || !canAdd || status === "added"}
				onClick={handleAddToCart}
				size={size}
				title={
					!canAdd ? "This bundle is not available for purchase" : undefined
				}
				variant={variant}
			>
				{label}
			</Button>
			{status === "error" && errorMessage ? (
				<p className="text-destructive text-xs">{errorMessage}</p>
			) : null}
		</div>
	);
}
