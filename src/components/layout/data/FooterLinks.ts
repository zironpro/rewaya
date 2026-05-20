export type FooterNavLink = {
	label: string;
	href: string;
};

export type FooterLinkColumn = {
	id: string;
	ariaLabel: string;
	title: string;
	links: FooterNavLink[];
};

export const FOOTER_SHOP_LINKS: FooterNavLink[] = [
	{ label: "New Arrivals", href: "/shop" },
	{ label: "Bestsellers", href: "/shop" },
	{ label: "Fiction", href: "/shop" },
	{ label: "Non-Fiction", href: "/shop" },
	{ label: "Children's", href: "/shop" },
	{ label: "Gift Cards", href: "/shop" },
	{ label: "Pre-Orders", href: "/shop" },
	{ label: "Sale", href: "/shop" },
];

export const FOOTER_DISCOVER_LINKS: FooterNavLink[] = [
	{ label: "Book Club", href: "/about" },
	{ label: "Reading Guides", href: "/about" },
	{ label: "Author Interviews", href: "/about" },
	{ label: "Blog", href: "/about" },
	{ label: "Gift Guides", href: "/bundles" },
	{ label: "Recommended Lists", href: "/shop" },
	{ label: "Events", href: "/contact" },
];

export const FOOTER_HELP_LINKS: FooterNavLink[] = [
	{ label: "My Account", href: "/profile" },
	{ label: "Track Order", href: "/profile" },
	{ label: "Returns & Exchanges", href: "/return" },
	{ label: "Shipping Info", href: "/terms" },
	{ label: "FAQs", href: "/contact" },
	{ label: "Contact Us", href: "/contact" },
	{ label: "Accessibility", href: "/contact" },
];

export const FOOTER_LINK_COLUMNS: FooterLinkColumn[] = [
	{
		id: "shop",
		ariaLabel: "Shop",
		title: "Shop",
		links: FOOTER_SHOP_LINKS,
	},
	{
		id: "discover",
		ariaLabel: "Discover",
		title: "Discover",
		links: FOOTER_DISCOVER_LINKS,
	},
	{
		id: "help",
		ariaLabel: "Help",
		title: "Help",
		links: FOOTER_HELP_LINKS,
	},
];

export const FOOTER_LEGAL_LINKS: FooterNavLink[] = [
	{ label: "Terms", href: "/terms" },
	{ label: "Privacy", href: "/privacy" },
	{ label: "Cookie Policy", href: "/terms#cookies" },
	{ label: "Accessibility", href: "/contact" },
];

export const FOOTER_STORE = {
	addressLines: [
		"Dubai Design District",
		"Building 4, Office 302",
		"Dubai, United Arab Emirates",
	],
	hours: "Sat–Thu 10:00–20:00 · Fri 14:00–22:00",
	phoneDisplay: "+971 4 123 4567",
	phoneTel: "+97141234567",
} as const;
