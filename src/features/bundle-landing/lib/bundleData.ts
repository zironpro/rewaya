import type { BundleData } from "../types/bundle";

const COVERS = {
	sealedNectar:
		"https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
	atomicHabits:
		"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
	alchemist:
		"https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
	fortress:
		"https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop",
	reclaimYourHeart:
		"https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800&auto=format&fit=crop",
} as const;

const essentialIslamicLibrary: BundleData = {
	slug: "essential-islamic-library",
	name: "Essential Islamic Library",
	tagline: "Five cornerstone reads for faith, habit, and reflection",
	description:
		"A curated shelf of classics and modern essentials — biography, devotion, fiction with meaning, and practical spirituality — at one special bundle price.",
	longDescription:
		"Whether you are building a home library or gifting someone their next season of reading, this set balances depth with readability. Each title stands alone; together they map a thoughtful path through seerah, daily worship, narrative wisdom, and heart-centered renewal.",
	price: 299,
	originalPrice: 419,
	savingsAmount: 120,
	wixProductId: undefined,
	books: [
		{
			id: "eil-1",
			title: "The Sealed Nectar",
			author: "Safiur Rahman Mubarakpuri",
			coverUrl: COVERS.sealedNectar,
			description:
				"A widely loved biography of the Prophet Muhammad (peace be upon him) — clear, comprehensive, and ideal as a reference and a first serious seerah read.",
		},
		{
			id: "eil-2",
			title: "Fortress of the Muslim",
			author: "Sa'id bin Ali al-Qahtani",
			coverUrl: COVERS.fortress,
			description:
				"Duas for every occasion — a pocket companion to keep morning and evening remembrances close, with Arabic and accessible English.",
		},
		{
			id: "eil-3",
			title: "Reclaim Your Heart",
			author: "Yasmin Mogahed",
			coverUrl: COVERS.reclaimYourHeart,
			description:
				"Reflections on attaching the heart to Allah through trials and transitions — compassionate, poetic, and deeply relatable.",
		},
		{
			id: "eil-4",
			title: "The Alchemist",
			author: "Paulo Coelho",
			coverUrl: COVERS.alchemist,
			description:
				"A timeless fable about purpose and journey — a lighter narrative counterweight that still invites contemplation on trust and destiny.",
		},
		{
			id: "eil-5",
			title: "Atomic Habits",
			author: "James Clear",
			coverUrl: COVERS.atomicHabits,
			description:
				"Small systems for consistent change — useful scaffolding for salah schedules, learning Arabic, or any spiritual routine you want to protect.",
		},
	],
	reviews: [
		{
			id: "r1",
			quote:
				"Beautifully boxed and exactly what I wanted for Ramadan — my husband reads the seerah, I reach for Reclaim Your Heart.",
			name: "Amina K.",
			location: "Dubai",
			rating: 5,
		},
		{
			id: "r2",
			quote:
				"Price felt fair for five hardcovers. Fortress of the Muslim alone lives on my bedside table now.",
			name: "Omar H.",
			location: "Sharjah",
			rating: 5,
		},
		{
			id: "r3",
			quote:
				"Shipped quickly across the UAE. The mix of practical and soulful books is thoughtful.",
			name: "Leila M.",
			location: "Abu Dhabi",
			rating: 4,
		},
	],
	relatedBundles: [
		{
			href: "/bundles",
			name: "Quran & Salah Essentials",
			price: 149,
			originalPrice: 165,
			imageUrl:
				"https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop",
			tag: "Kids favorite",
		},
		{
			href: "/bundles",
			name: "Kids Activity & Stories",
			price: 115,
			originalPrice: 130,
			imageUrl:
				"https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop",
			tag: "Best seller",
		},
	],
	faqs: [
		{
			id: "faq-1",
			question: "Are these exact editions in stock?",
			answer:
				"Cover art shown is representative while we align print runs with suppliers. You always receive the titled work in English (or bilingual where noted) at the advertised bundle tier.",
		},
		{
			id: "faq-2",
			question: "Do you deliver across the UAE?",
			answer:
				"Yes — standard UAE delivery windows apply at checkout. Remote areas may need an extra day; you will see options before you pay.",
		},
		{
			id: "faq-3",
			question: "Can I return the bundle?",
			answer:
				"Our store policy applies to sealed items. If something arrives damaged, contact support with photos and we will make it right.",
		},
		{
			id: "faq-4",
			question: "Why is checkout showing the cart instead of instant buy?",
			answer:
				"This campaign uses the same secure Rewaya checkout you already trust. Add from the bundle page, then review shipping and payment in your cart.",
		},
	],
};

const bySlug: Record<string, BundleData> = {
	[essentialIslamicLibrary.slug]: essentialIslamicLibrary,
};

export function getBundleBySlug(slug: string): BundleData | null {
	return bySlug[slug] ?? null;
}

export function getAllBundleSlugs(): string[] {
	return Object.keys(bySlug);
}
