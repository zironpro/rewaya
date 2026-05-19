import Image from "next/image";
import Link from "next/link";

import { Mail, MapPin, Phone } from "lucide-react";

import {
	FacebookIcon,
	InstagramIcon,
	TwitterIcon,
} from "@/assets/icons/brands";

export function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="mt-12 border-t bg-foreground py-20 text-muted/80">
			<div className="container mx-auto px-6">
				<div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-4">
					<div className="col-span-1 md:col-span-1">
						<div className="mb-8">
							<Image
								alt="Al Rewaya Logo"
								className="h-16 w-auto object-contain"
								height={64}
								src="/logo.png"
								width={260}
							/>
						</div>
						<p className="mb-6 text-sm leading-relaxed">
							Rewaya is more than just a bookstore. It's a gateway to knowledge,
							imagination, and spiritual growth. Founded in the heart of the
							UAE, serving the global reader.
						</p>
						<div className="flex gap-4">
							<Link
								className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-800 text-stone-400 transition-all hover:border-primary hover:bg-primary hover:text-white"
								href="#"
							>
								<InstagramIcon size={18} />
							</Link>
							<Link
								className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-800 text-stone-400 transition-all hover:border-primary hover:bg-primary hover:text-white"
								href="#"
							>
								<TwitterIcon size={18} />
							</Link>
							<Link
								className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-800 text-stone-400 transition-all hover:border-primary hover:bg-primary hover:text-white"
								href="#"
							>
								<FacebookIcon size={18} />
							</Link>
						</div>
					</div>

					<div>
						<h4 className="mb-6 font-bold text-primary">Quick Links</h4>
						<ul className="flex flex-col gap-4 text-sm">
							<li>
								<Link className="transition-colors hover:text-primary" href="#">
									Our Story
								</Link>
							</li>
							<li>
								<Link className="transition-colors hover:text-primary" href="#">
									Track Order
								</Link>
							</li>
							<li>
								<Link className="transition-colors hover:text-primary" href="#">
									Shipping Policy
								</Link>
							</li>
							<li>
								<Link className="transition-colors hover:text-primary" href="#">
									Return Policy
								</Link>
							</li>
							<li>
								<Link className="transition-colors hover:text-primary" href="#">
									Contact Us
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="mb-6 font-bold text-primary">Categories</h4>
						<ul className="flex flex-col gap-4 text-sm">
							<li>
								<Link className="transition-colors hover:text-primary" href="#">
									Islamic Books
								</Link>
							</li>
							<li>
								<Link className="transition-colors hover:text-primary" href="#">
									Personal Development
								</Link>
							</li>
							<li>
								<Link className="transition-colors hover:text-primary" href="#">
									Biographies
								</Link>
							</li>
							<li>
								<Link className="transition-colors hover:text-primary" href="#">
									Children's Books
								</Link>
							</li>
							<li>
								<Link className="transition-colors hover:text-primary" href="#">
									New Releases
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="mb-6 font-bold text-primary">Store Info</h4>
						<ul className="flex flex-col gap-4 text-sm">
							<li className="flex items-start gap-3">
								<MapPin className="mt-1 text-primary" size={18} />
								<span>
									Dubai Design District, Building 4, Office 302, Dubai, UAE
								</span>
							</li>
							<li className="flex items-center gap-3">
								<Phone className="text-primary" size={18} />
								<span>+971 4 123 4567</span>
							</li>
							<li className="flex items-center gap-3">
								<Mail className="text-primary" size={18} />
								<span>hello@rewayabooks.com</span>
							</li>
						</ul>
					</div>
				</div>

				<div className="flex flex-col items-center justify-between gap-4 border-stone-900 border-t pt-8 md:flex-row">
					<p className="text-sm">© {year} Rewaya Books. All rights reserved.</p>
					<div className="flex gap-6 font-medium text-xs">
						<Link
							className="transition-colors hover:text-white"
							href="/privacy"
						>
							Privacy Policy
						</Link>
						<Link className="transition-colors hover:text-white" href="/terms">
							Terms of Service
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
