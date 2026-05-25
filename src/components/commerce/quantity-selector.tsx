"use client";

import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
	quantity: number;
	onQuantityChange: (qty: number) => void;
	disabled?: boolean;
}

export function QuantitySelector({
	quantity,
	onQuantityChange,
	disabled,
}: QuantitySelectorProps) {
	return (
		<div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
			<span className="font-medium text-secondary text-sm">Quantity</span>
			<div className="flex items-center gap-1">
				<Button
					aria-label="Decrease quantity"
					className="size-8"
					disabled={disabled || quantity <= 1}
					onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
					size="icon"
					type="button"
					variant="outline"
				>
					<span className="text-lg leading-none">−</span>
				</Button>
				<span className="w-10 text-center font-bold text-sm">{quantity}</span>
				<Button
					aria-label="Increase quantity"
					className="size-8"
					disabled={disabled}
					onClick={() => onQuantityChange(quantity + 1)}
					size="icon"
					type="button"
					variant="outline"
				>
					<span className="text-lg leading-none">+</span>
				</Button>
			</div>
		</div>
	);
}
