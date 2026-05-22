/**
 * Static fallback catalog when WIX_CLIENT_ID is unset or CMS bundles are not seeded.
 * Live catalog: Wix Stores V1 + CMS collection `BundleDetails`.
 */
export interface Book {
	id: string;
	title: string;
	isbn: string;
	publisher: string;
	author?: string;
	language?: string;
	genre?: string;
	overview: string;
	image: string;
	price: number;
	originalPrice: number;
}

export interface RelatedBundle {
	href: string;
	name: string;
	price: number;
	originalPrice: number;
	imageUrl: string;
	tag: string;
}

export interface Faq {
	id: string;
	question: string;
	answer: string;
}

export interface Bundle {
	id: string;
	title: string;
	price: number;
	originalPrice: number;
	tag: string;
	tagline: string;
	description: string;
	longDescription: string;
	coverImage: string;
	books: Book[];
	/** Wix Stores product ID for checkout */
	wixProductId?: string;
	faqs: Faq[];
}

export const bundles: Bundle[] = [
	{
		id: "creative-brain-booster-pack",
		title: "Creative Brain Booster Fun Pack",
		price: 140,
		originalPrice: 220,
		tag: "Best Seller",
		tagline: "Five cornerstone reads for faith, habit, and reflection",
		description:
			"A curated shelf of classics and modern essentials: biography, devotion, fiction with meaning, and practical spirituality — at one special bundle price.",
		longDescription:
			"Whether you are building a home library or gifting someone their next season of reading, this set balances depth with readability. Each title stands alone; together they map a thoughtful path through seerah, daily worship, narrative wisdom, and heart-centered renewal.",
		coverImage: "/bundles/creative-brain-booster-pack.webp",
		books: [
			{
				id: "b1-1",
				title: "Amazing Flash Card Set of 4 Boxes",
				isbn: "9555832904756",
				publisher: "Al-Rewaya Kids",
				language: "English",
				overview:
					"A beautiful exploration of the story of the horse as mentioned in the Holy Quran, tailored for young minds.",
				image: "/products/flash-card-1.webp",
				price: 30,
				originalPrice: 39,
			},
			{
				id: "b1-2",
				title: "Cursive Handwriting word family",
				isbn: "97889670618753",
				publisher: "Al-Rewaya Kids",
				language: "English",
				overview:
					"This book is designed to help children learn to write in cursive handwriting. It is a fun and engaging way to learn to write in cursive handwriting.",
				image: "/products/cursive-handwriting.webp",
				price: 10,
				originalPrice: 25,
			},
			{
				id: "b1-3",
				title: "Reusable Wipe and Clean Book - Patterns",
				isbn: "97889673420636",
				publisher: "Al-Rewaya Kids",
				language: "English",
				overview:
					"This book is designed to help children learn to write in cursive handwriting. It is a fun and engaging way to learn to write in cursive handwriting.",
				image: "/products/patterns.webp",
				price: 12,
				originalPrice: 25,
			},
			{
				id: "b1-4",
				title: "101 Brain Booster Activity Book",
				isbn: "97889672972853",
				publisher: "Al-Rewaya Kids",
				language: "English",
				overview:
					"This book is designed to help children learn to write in cursive handwriting. It is a fun and engaging way to learn to write in cursive handwriting.",
				image: "/products/101-brain-booster.webp",
				price: 15,
				originalPrice: 30,
			},
			{
				id: "b1-5",
				title: "Colour with Sticker-Unicorn Adventure",
				isbn: "97889672972846",
				publisher: "Al-Rewaya Kids",
				language: "English",
				overview:
					"This book is designed to help children learn to write in cursive handwriting. It is a fun and engaging way to learn to write in cursive handwriting.",
				image: "/products/color-with-sticker.webp",
				price: 20,
				originalPrice: 30,
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
	},
	{
		id: "little-muslim-learners-starter-pack",
		title: "Little Muslim Learners Starter Pack",
		price: 144,
		originalPrice: 172,
		tag: "Best Seller",
		tagline:
			"A curated shelf of classics and modern essentials for young learners",
		description:
			"A curated shelf of classics and modern essentials: biography, devotion, fiction with meaning, and practical spirituality — at one special bundle price.",
		longDescription:
			"Whether you are building a home library or gifting someone their next season of reading, this set balances depth with readability. Each title stands alone; together they map a thoughtful path through seerah, daily worship, narrative wisdom, and heart-centered renewal.",
		coverImage: "/bundles/creative-brain-booster-pack.webp",
		books: [
			{
				id: "b1-1",
				title: "Amazing Flash Card Set of 4 Boxes",
				isbn: "9555832904756",
				publisher: "Al-Rewaya Kids",
				language: "English",
				overview:
					"A beautiful exploration of the story of the horse as mentioned in the Holy Quran, tailored for young minds.",
				image: "/products/flash-card-1.webp",
				price: 30,
				originalPrice: 39,
			},
			{
				id: "b1-2",
				title: "Cursive Handwriting word family",
				isbn: "97889670618753",
				publisher: "Al-Rewaya Kids",
				language: "English",
				overview:
					"This book is designed to help children learn to write in cursive handwriting. It is a fun and engaging way to learn to write in cursive handwriting.",
				image: "/products/cursive-handwriting.webp",
				price: 10,
				originalPrice: 25,
			},
			{
				id: "b1-3",
				title: "Reusable Wipe and Clean Book - Patterns",
				isbn: "97889673420636",
				publisher: "Al-Rewaya Kids",
				language: "English",
				overview:
					"This book is designed to help children learn to write in cursive handwriting. It is a fun and engaging way to learn to write in cursive handwriting.",
				image: "/products/patterns.webp",
				price: 12,
				originalPrice: 25,
			},
			{
				id: "b1-4",
				title: "101 Brain Booster Activity Book",
				isbn: "97889672972853",
				publisher: "Al-Rewaya Kids",
				language: "English",
				overview:
					"This book is designed to help children learn to write in cursive handwriting. It is a fun and engaging way to learn to write in cursive handwriting.",
				image: "/products/101-brain-booster.webp",
				price: 15,
				originalPrice: 30,
			},
			{
				id: "b1-5",
				title: "Colour with Sticker-Unicorn Adventure",
				isbn: "97889672972846",
				publisher: "Al-Rewaya Kids",
				language: "English",
				overview:
					"This book is designed to help children learn to write in cursive handwriting. It is a fun and engaging way to learn to write in cursive handwriting.",
				image: "/products/color-with-sticker.webp",
				price: 20,
				originalPrice: 30,
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
	},
];
