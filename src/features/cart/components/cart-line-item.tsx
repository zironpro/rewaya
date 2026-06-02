"use client";

import Image from "next/image";
import Link from "next/link";

import { Minus, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
	firstDescriptionSubtitle,
	isItemUnavailable,
	type LineItem,
	resolveCartImage,
	resolveLineItemHref,
} from "@/features/cart/cart-sdk";
import { cn } from "@/lib/utils";

interface CartLineItemProps {
	item: LineItem;
	onUpdateQuantity: (lineId: string, quantity: number) => void;
	onRemove: (lineId: string) => void;
}

export function CartLineItem({
	item,
	onUpdateQuantity,
	onRemove,
}: CartLineItemProps) {
	const lineId = item._id ?? "";
	const unavailable = isItemUnavailable(item);
	const maxQty = item.availability?.quantityAvailable ?? 99;
	const href = !unavailable ? resolveLineItemHref(item) : undefined;
	const isBundle = Boolean(item.isBundle);
	const imageUrl = resolveCartImage(item.image, 200, 280);
	const subtitle = firstDescriptionSubtitle(item);
	const hasDiscount =
		item.fullPrice?.formattedConvertedAmount &&
		item.fullPrice.formattedConvertedAmount !==
			item.price?.formattedConvertedAmount;

	const unavailableLabel =
		item.availability?.status === "NOT_FOUND"
			? "No longer available"
			: "Out of stock";

	return (
		<div
			className={cn(
				"grid grid-cols-1 items-center gap-8 border-b pb-8 md:grid-cols-4",
				unavailable && "opacity-75"
			)}
		>
			<div className="col-span-2 flex gap-6">
				<div className="relative aspect-3/4 h-24 shrink-0 overflow-hidden rounded-sm bg-card sm:h-32">
					{imageUrl ? (
						href ? (
							<Link className="block h-full w-full" href={href}>
								<Image
									alt={item.productName?.translated ?? "Product"}
									className="object-cover"
									fill
									sizes="96px"
									src={imageUrl}
								/>
							</Link>
						) : (
							<Image
								alt={item.productName?.translated ?? "Product"}
								className="object-cover"
								fill
								sizes="96px"
								src={imageUrl}
							/>
						)
					) : null}
				</div>
				<div className="flex flex-col justify-center gap-1">
					<div className="flex gap-2">
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
						{isBundle ? (
							<Badge className="mt-0.5 w-fit" size="sm" variant="secondary">
								Bundle
							</Badge>
						) : null}
					</div>
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
					{unavailable && (
						<Badge className="mt-1 w-fit" size="sm" variant="error">
							{unavailableLabel}
						</Badge>
					)}
					<Button
						className="mt-1 w-fit text-xs"
						onClick={() => lineId && onRemove(lineId)}
						size="xs"
						type="button"
						variant="destructive"
					>
						<Trash2 size={12} />
						Remove
					</Button>
				</div>
			</div>

			<div className="flex items-center justify-center">
				{unavailable ? (
					<span className="text-sm text-stone-400">—</span>
				) : (
					<div className="flex items-center rounded-sm border border-stone-200 bg-card">
						<Button
							aria-label="Decrease quantity"
							className="size-8 rounded-none"
							disabled={!item.quantity || item.quantity <= 1}
							onClick={() =>
								lineId && onUpdateQuantity(lineId, (item.quantity ?? 1) - 1)
							}
							size="icon"
							type="button"
							variant="outline"
						>
							<Minus size={12} />
						</Button>
						<span className="w-10 text-center font-bold text-sm">
							{item.quantity}
						</span>
						<Button
							aria-label="Increase quantity"
							className="size-8 rounded-none"
							disabled={(item.quantity ?? 0) >= maxQty}
							onClick={() =>
								lineId && onUpdateQuantity(lineId, (item.quantity ?? 1) + 1)
							}
							size="icon"
							type="button"
							variant="outline"
						>
							<Plus size={12} />
						</Button>
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
		</div>
	);
}
