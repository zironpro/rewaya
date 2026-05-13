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
        "flex items-center gap-2 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-stone-400",
        className
      )}
    >
      <Link 
        href="/" 
        className="hover:text-primary transition-colors"
      >
        Home
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={12} className="shrink-0 opacity-50" />
          {item.href ? (
            <Link 
              href={item.href} 
              className="hover:text-primary transition-colors truncate max-w-[120px] md:max-w-[200px]"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-secondary truncate max-w-[120px] md:max-w-[300px]">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
