"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

import type { BundleData } from "../types/bundle";

interface BundleFaqSectionProps {
	bundle: BundleData;
}

export function BundleFaqSection({ bundle }: BundleFaqSectionProps) {
	return (
		<section className="py-14 md:py-20">
			<div className="mx-auto max-w-3xl px-4 sm:px-6">
				<h2 className="text-center font-display text-2xl text-[var(--bundle-ink)] tracking-tight md:text-3xl">
					Questions
				</h2>
				<p className="mt-2 text-center font-[family-name:var(--font-editorial)] text-[var(--bundle-muted)]">
					Everything about delivery, editions, and checkout for {bundle.name}.
				</p>
				<Accordion
					className="mt-8 rounded-lg border border-[var(--bundle-gold)]/20 bg-white/70 px-2 shadow-sm"
					defaultValue={bundle.faqs[0]?.id ? [bundle.faqs[0].id] : undefined}
				>
					{bundle.faqs.map((faq) => (
						<AccordionItem key={faq.id} value={faq.id}>
							<AccordionTrigger className="px-3 font-display text-[var(--bundle-ink)]">
								{faq.question}
							</AccordionTrigger>
							<AccordionContent className="px-3 font-[family-name:var(--font-editorial)] text-[var(--bundle-muted)]">
								{faq.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</section>
	);
}
