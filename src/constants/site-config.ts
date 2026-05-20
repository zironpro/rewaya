import { FacebookIcon, InstagramIcon } from "@/assets/icons/brands";

export const SOCIAL_LINKS = [
	{
		href: "https://www.instagram.com",
		label: "Follow us on Instagram",
		Icon: InstagramIcon,
	},
	{
		href: "https://www.facebook.com",
		label: "Follow us on Facebook",
		Icon: FacebookIcon,
	},
] as const;
