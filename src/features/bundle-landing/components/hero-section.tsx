"use client";

import Image from "next/image";
import Link from "next/link";

import { ShoppingCartIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { CurrencyIcon } from "@/assets/icons/currency";

import type { BundleData } from "../types/bundle";
import { CountdownTimer } from "./countdown-timer";
import { BookMosaic } from "./ui/book-mosic";

interface HeroSectionProps {
	bundle: BundleData;
}

export function HeroSection({ bundle }: HeroSectionProps) {
	return (
		<section
			className="relative min-h-[calc(100svh-(--spacing(16)))] overflow-hidden"
			id="bundle-hero"
		>
			<div className="container relative flex flex-col gap-8 px-4 pt-10 pb-16 md:min-h-[calc(100svh-(--spacing(16)))] md:items-center md:gap-12 md:px-8 md:pt-16 md:pb-20">
				<BookMosaic />
				<div className="relative z-10 flex flex-col items-center justify-center">
					<CountdownTimer slug={bundle.slug} />

					<h1 className="mt-3 font-bold font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.08] tracking-tight">
						{bundle.name}
					</h1>
					<p className="mt-2 max-w-xl text-base text-muted-foreground leading-relaxed sm:text-lg">
						{bundle.tagline}
					</p>
					<div className="mt-4 mb-6 items-center gap-4">
						<span className="font-black font-display text-3xl text-primary">
							AED {bundle.price}
						</span>
						<div className="mt-2 flex items-center gap-2">
							<span className="relative flex items-center gap-1 text-muted-foreground/60 text-sm">
								<CurrencyIcon className="size-3" /> {bundle.originalPrice}
								<span className="absolute top-1/2 left-1/2 h-px w-[115%] -translate-x-1/2 -translate-y-1/2 bg-muted-foreground/60" />
							</span>
							<Badge size="sm" variant="success">
								Save{" "}
								<span className="font-bold">AED {bundle.savingsAmount}</span>
							</Badge>
						</div>
					</div>
					<Button
						className="btn-shimmer hover:px-6"
						nativeButton={false}
						render={<Link href={`/bundles/${bundle.slug}`} />}
						size="lg"
					>
						Get your bundle now <ShoppingCartIcon className="ml-2 size-4" />
					</Button>
					<div className="relative mt-10 aspect-5/3 w-2xl">
						<Image
							alt="Bundle Hero"
							className="rounded-md object-cover"
							fill
							src="/bundles/creative-brain-booster-pack.webp"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
