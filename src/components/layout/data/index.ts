import { Baby, Feather, Moon, Package, Sparkles, Zap } from "lucide-react";

export const MEGA_MENU_DATA = {
	categories: [
		{
			name: "Islamic Studies",
			items: ["Theology", "Hadith", "Quranic Tafsir", "Seerah", "Fiqh"],
		},
		{
			name: "Literature",
			items: ["Contemporary Fiction", "Arabic Classics", "Poetry", "Drama"],
		},
		{
			name: "Self-Development",
			items: ["Productivity", "Spirituality", "Psychology", "Leadership"],
		},
		{
			name: "Children & YA",
			items: [
				"Picture Books",
				"Graphic Novels",
				"Arabic Learning",
				"Young Adult",
			],
		},
	],
	featured: {
		title: "Collection of the Month",
		image:
			"https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
		tag: "CURATED",
	},
};
export const CATEGORIES = [
	{
		name: "Shop All",
		href: "/shop",
		icon: Sparkles,
	},
	{
		name: "Today's Deals",
		href: "/#deals",
		icon: Zap,
	},
	{
		name: "Islamic",
		href: "/#islamic",
		icon: Moon,
	},
	{
		name: "Fiction",
		href: "/#fiction",
		icon: Feather,
	},
	{
		name: "Children",
		href: "/#children",
		icon: Baby,
	},
	{
		name: "Bundles",
		href: "/bundles",
		icon: Package,
	},
	{
		name: "New Arrivals",
		href: "/#new",
		icon: Sparkles,
	},
];
