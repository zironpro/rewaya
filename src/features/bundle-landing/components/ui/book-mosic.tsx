"use client";

import Image from "next/image";

import { domAnimation, LazyMotion, m, useReducedMotion } from "framer-motion";

type BookCell = {
	alt: string;
	gridClass: string;
	hidden: {
		opacity: number;
		y: number;
		x: number;
		rotate: number;
		scale: number;
		filter: string;
	};
	src: string;
	tileClass: string;
};

const books: BookCell[] = [
	{
		alt: "Book 1",
		gridClass: "col-start-1 row-start-1",
		tileClass:
			"place-self-center rounded-sm shadow-sm transition-[box-shadow] hover:shadow-md",
		src: "/products/book-1.jpg",
		hidden: {
			opacity: 0,
			y: 48,
			x: -20,
			rotate: -12,
			scale: 0.82,
			filter: "blur(6px)",
		},
	},
	{
		alt: "Book 2",
		gridClass: "col-start-2 row-start-1 md:col-start-3",
		tileClass:
			"place-self-center rounded-sm shadow-sm transition-[box-shadow] hover:shadow-md md:place-self-end",
		src: "/products/book-2.jpg",
		hidden: {
			opacity: 0,
			y: -40,
			x: 24,
			rotate: 10,
			scale: 0.82,
			filter: "blur(6px)",
		},
	},
	{
		alt: "Book 3",
		gridClass: "col-start-1 row-start-2 md:row-start-2",
		tileClass:
			"place-self-center rounded-sm shadow-sm transition-[box-shadow] hover:shadow-md",
		src: "/products/book-3.jpg",
		hidden: {
			opacity: 0,
			y: 20,
			x: -36,
			rotate: -8,
			scale: 0.82,
			filter: "blur(6px)",
		},
	},
	{
		alt: "Book 4",
		gridClass: "col-start-2 row-start-2 md:col-start-3 md:row-start-2",
		tileClass:
			"place-self-center rounded-sm shadow-sm transition-[box-shadow] hover:shadow-md md:place-self-end",
		src: "/products/book-4.jpg",
		hidden: {
			opacity: 0,
			y: 44,
			x: 28,
			rotate: 12,
			scale: 0.82,
			filter: "blur(6px)",
		},
	},
];

const containerVariants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.12,
			delayChildren: 0.2,
		},
	},
};

const itemVariants = {
	hidden: (book: BookCell) => book.hidden,
	visible: {
		opacity: 1,
		y: 0,
		x: 0,
		rotate: 0,
		scale: 1,
		filter: "blur(0px)",
		transition: {
			type: "spring" as const,
			stiffness: 320,
			damping: 24,
			mass: 0.85,
		},
	},
};

function BookTile({
	book,
	prefersReducedMotion,
}: {
	book: BookCell;
	prefersReducedMotion: boolean | null;
}) {
	return (
		<m.div
			className={`${book.gridClass} ${book.tileClass}`}
			custom={book}
			variants={prefersReducedMotion ? undefined : itemVariants}
			whileHover={
				prefersReducedMotion
					? undefined
					: { scale: 1.05, rotate: book.hidden.rotate > 0 ? 2 : -2 }
			}
		>
			<Image
				alt={book.alt}
				className="h-auto w-full max-w-18 rounded-sm sm:max-w-22 md:max-w-30 lg:max-w-50"
				height={340}
				sizes="(max-width: 640px) 72px, (max-width: 768px) 88px, (max-width: 1024px) 120px, 200px"
				src={book.src}
				width={200}
			/>
		</m.div>
	);
}

export const BookMosaic = () => {
	const prefersReducedMotion = useReducedMotion();

	return (
		<LazyMotion features={domAnimation}>
			<div
				aria-hidden
				className="pointer-events-none relative z-0 mx-auto mb-4 w-full max-w-68 shrink-0 sm:max-w-80 md:absolute md:inset-0 md:mx-0 md:mb-0 md:max-w-none"
			>
				<m.div
					animate={prefersReducedMotion ? undefined : "visible"}
					className="grid h-full grid-cols-2 place-items-center gap-3 px-2 py-2 sm:gap-4 sm:px-4 md:grid-cols-3 md:gap-8 md:px-8 md:py-12 lg:gap-12 lg:py-16"
					initial={prefersReducedMotion ? false : "hidden"}
					variants={prefersReducedMotion ? undefined : containerVariants}
				>
					{books.map((book) => (
						<BookTile
							book={book}
							key={book.src}
							prefersReducedMotion={prefersReducedMotion}
						/>
					))}
				</m.div>
			</div>
		</LazyMotion>
	);
};
