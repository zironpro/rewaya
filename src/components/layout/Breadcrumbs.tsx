"use client";

import React from "react";

import Link from "next/link";

import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface BreadcrumbItem {
	label: string;
	href?: string;
}

interface BreadcrumbsProps {
	items: BreadcrumbItem[];
	className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
	return (
		<nav
			aria-label="Breadcrumb"
			className={cn(
				"flex items-center gap-2 font-bold text-sm text-stone-400",
				className
			)}
		>
			<Link className="transition-colors hover:text-primary" href="/">
				Home
			</Link>

			{items.map((item, index) => (
				<React.Fragment key={Number(index)}>
					<ChevronRight className="shrink-0 opacity-50" size={12} />
					{item.href ? (
						<Link
							className="max-w-[120px] truncate transition-colors hover:text-primary md:max-w-[200px]"
							href={item.href}
						>
							{item.label}
						</Link>
					) : (
						<span className="max-w-[120px] truncate text-secondary md:max-w-[300px]">
							{item.label}
						</span>
					)}
				</React.Fragment>
			))}
		</nav>
	);
}
