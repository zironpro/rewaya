import Image from "next/image";

import { BundleData } from "../../types/bundle";

export function CompactBookTile({
	book,
	index: bookIndex,
}: {
	book: BundleData["books"][number];
	index: number;
}) {
	return (
		<li className="w-[min(100%,220px)] shrink-0 snap-start sm:w-[240px] lg:w-full">
			<div className="group flex items-center gap-3 rounded-lg border border-border/80 bg-card p-3 transition-[scale,box-shadow,border-color] hover:scale-102 hover:border-primary/30 hover:bg-card hover:shadow-md">
				<div className="relative aspect-4/5 w-20 shrink-0 overflow-hidden rounded-md shadow-sm md:w-28">
					<Image
						alt={book.title}
						className="object-cover"
						fill
						sizes="56px"
						src={book.coverUrl}
					/>
				</div>
				<div className="min-w-0 flex-1">
					<p className="font-medium text-[0.65rem] text-gold uppercase tracking-wider">
						Vol. {String(bookIndex + 1).padStart(2, "0")}
					</p>
					<h4 className="mt-0.5 line-clamp-2 font-bold font-display text-secondary text-sm leading-snug sm:text-lg md:text-xl">
						{book.title}
					</h4>
					<p className="mt-0.5 truncate font-light text-muted-foreground text-sm">
						{book.author}
					</p>
				</div>
			</div>
		</li>
	);
}
