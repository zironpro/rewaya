import { Heart, ShoppingBagIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import type { Bundle } from "@/lib/bundles-data";
import { cn } from "@/lib/utils";

interface BundleBuyBoxProps {
	bundle: Bundle;
	className?: string;
}

export function BundleBuyBox({ bundle, className }: BundleBuyBoxProps) {
	return (
		<div className={cn(className)}>
			<div className="sticky top-28 rounded-[2rem] border-2 border-stone-100 bg-white p-6">
				<div className="border-stone-50 border-b pb-3">
					<span className="text-muted-foreground text-xs">Bundle contents</span>
					<h3 className="font-bold text-secondary text-sm">
						{bundle.count} Essential volumes
					</h3>
				</div>
				<ScrollArea className="mb-4 max-h-[280px]">
					<div className="space-y-3 pr-2">
						{bundle.books.map((book, i) => (
							<div
								className="group/item flex cursor-pointer items-start"
								key={book.id}
							>
								<span className="mt-0.5 w-8 shrink-0 font-bold text-muted-foreground text-xs">
									{(i + 1).toString().padStart(2, "0")}
								</span>
								<p className="font-bold text-sm text-stone-500 leading-tight transition-colors group-hover/item:text-primary">
									{book.title}
								</p>
							</div>
						))}
					</div>
				</ScrollArea>

				<Button className="w-full gap-3" size="lg" variant="secondary">
					<ShoppingBagIcon />
					Add to Cart
				</Button>

				<Separator className="my-4" />

				<Button className="w-full justify-between" variant="ghost">
					Add to wish list
					<Heart
						className="transition-all group-hover:fill-primary group-hover:text-primary"
						size={16}
					/>
				</Button>
			</div>
		</div>
	);
}
