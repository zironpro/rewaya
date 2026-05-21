"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

import { useCountdown } from "../hooks/useCountdown";

interface CountdownTimerProps {
	slug: string;
	className?: string;
	/** Default: light card on linen; `dark` for CTA footer */
	variant?: "default" | "dark";
}

export function CountdownTimer({
	slug,
	className,
	variant = "default",
}: CountdownTimerProps) {
	const { parts, expired } = useCountdown(slug);

	const box =
		variant === "dark"
			? "border-white/15 bg-black/25 text-gold"
			: "border-gold bg-white text-primary";

	return (
		<div
			className={cn(
				"w-fit rounded-md border px-3 py-2 text-sm",
				box,
				className
			)}
		>
			{expired ? (
				<p className="text-center text-xs leading-relaxed">
					This launch window has ended.{" "}
					<Link
						className="font-medium text-accent underline-offset-2 hover:underline"
						href="/bundles"
					>
						Browse all bundles
					</Link>
				</p>
			) : (
				<div className="flex items-center justify-center gap-1.5 tabular-nums">
					<span className={cn("rounded px-1.5 py-0.5 font-bold", box)}>
						{parts.h}
					</span>
					<span className="colon-blink font-bold">:</span>
					<span className={cn("rounded px-1.5 py-0.5 font-bold", box)}>
						{parts.m}
					</span>
					<span className="colon-blink font-bold">:</span>
					<span className={cn("rounded px-1.5 py-0.5 font-bold", box)}>
						{parts.s}
					</span>
					<span className="ml-2 hidden text-xs opacity-80 sm:inline">
						left at this price
					</span>
				</div>
			)}
		</div>
	);
}
