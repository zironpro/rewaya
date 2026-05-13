"use client";

import { useEffect, useRef, useState } from "react";

import { ChevronLeft, ChevronRight, Timer } from "lucide-react";

import BookCard, { BookProps } from "./BookCard";

const CountdownTimer = () => {
	const [timeLeft, setTimeLeft] = useState({
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	useEffect(() => {
		const calculateTimeLeft = () => {
			const now = new Date();
			const endOfDay = new Date();
			endOfDay.setHours(23, 59, 59, 999);

			const difference = endOfDay.getTime() - now.getTime();

			if (difference > 0) {
				setTimeLeft({
					hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
					minutes: Math.floor((difference / 1000 / 60) % 60),
					seconds: Math.floor((difference / 1000) % 60),
				});
			}
		};

		calculateTimeLeft();
		const timer = setInterval(calculateTimeLeft, 1000);
		return () => clearInterval(timer);
	}, []);

	const format = (n: number) => n.toString().padStart(2, "0");

	return (
		<div className="flex items-center gap-2 rounded-lg border border-stone-100 bg-stone-50 px-4 py-2">
			<Timer className="animate-pulse text-primary" size={14} />
			<div className="flex items-center gap-1 font-black font-mono text-xm">
				<span className="text-secondary">{format(timeLeft.hours)}</span>
				<span className="text-stone-300">:</span>
				<span className="text-secondary">{format(timeLeft.minutes)}</span>
				<span className="text-stone-300">:</span>
				<span className="text-secondary">{format(timeLeft.seconds)}</span>
			</div>
		</div>
	);
};

interface ProductStripProps {
	title: string;
	subtitle?: string;
	books: BookProps[];
}

export default function ProductStrip({
	title,
	subtitle,
	books,
}: ProductStripProps) {
	const scrollRef = useRef<HTMLDivElement>(null);

	const scroll = (direction: "left" | "right") => {
		if (scrollRef.current) {
			const { scrollLeft, clientWidth } = scrollRef.current;
			const scrollTo =
				direction === "left"
					? scrollLeft - clientWidth * 0.8
					: scrollLeft + clientWidth * 0.8;

			scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
		}
	};

	return (
		<section className="group/strip container mx-auto px-6 py-16">
			<div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
				<div>
					{subtitle && (
						<span className="mb-3 block font-bold text-base text-primary uppercase tracking-wider">
							{subtitle}
						</span>
					)}
					<div className="flex flex-wrap items-center gap-4 md:gap-6">
						<h2 className="whitespace-nowrap font-black font-serif text-2xl md:text-4xl">
							{title.split(" ").map((word, i) => (
								<span
									className={i % 2 !== 0 ? "font-normal italic" : ""}
									key={Number(i + 1)}
								>
									{word}{" "}
								</span>
							))}
						</h2>
						{title === "Today's Deals" && <CountdownTimer />}
					</div>
				</div>
				<div className="flex gap-2">
					<button
						className="rounded-full border border-stone-100 p-3 text-stone-400 transition-all hover:border-primary hover:bg-stone-50 hover:text-primary"
						onClick={() => scroll("left")}
					>
						<ChevronLeft size={20} />
					</button>
					<button
						className="rounded-full border border-stone-100 p-3 text-stone-400 transition-all hover:border-primary hover:bg-stone-50 hover:text-primary"
						onClick={() => scroll("right")}
					>
						<ChevronRight size={20} />
					</button>
				</div>
			</div>

			<div
				className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-8"
				ref={scrollRef}
			>
				{books.map((book, i) => (
					<div
						className="min-w-[240px] snap-start md:min-w-[280px]"
						key={`${book.id}-${Number(i + 1)}`}
					>
						<BookCard {...book} />
					</div>
				))}
				{/* View All Card */}
				<div className="group flex min-w-[240px] cursor-pointer items-center justify-center border-2 border-stone-100 border-dashed transition-colors hover:border-primary/30 md:min-w-[280px]">
					<div className="text-center">
						<span className="font-bold text-stone-300 text-xm transition-colors group-hover:text-primary">
							View All <br /> Collection
						</span>
					</div>
				</div>
			</div>
		</section>
	);
}
