import Image from "next/image";

import { Mail, MapPin, Phone } from "lucide-react";

// Brand SVG components for social media
const InstagramIcon = ({ size = 18 }) => (
	<svg
		fill="none"
		height={size}
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth="2"
		viewBox="0 0 24 24"
		width={size}
	>
		<rect height="20" rx="5" ry="5" width="20" x="2" y="2" />
		<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
		<line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
	</svg>
);

const TwitterIcon = ({ size = 18 }) => (
	<svg
		fill="none"
		height={size}
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth="2"
		viewBox="0 0 24 24"
		width={size}
	>
		<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
	</svg>
);

const FacebookIcon = ({ size = 18 }) => (
	<svg
		fill="none"
		height={size}
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth="2"
		viewBox="0 0 24 24"
		width={size}
	>
		<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
	</svg>
);

export function Footer() {
	return (
		<footer className="mt-20 border-stone-900 border-t bg-stone-950 py-20 text-stone-400">
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
							<a
								className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-800 text-stone-400 transition-all hover:border-primary hover:bg-primary hover:text-white"
								href="#"
							>
								<InstagramIcon size={18} />
							</a>
							<a
								className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-800 text-stone-400 transition-all hover:border-primary hover:bg-primary hover:text-white"
								href="#"
							>
								<TwitterIcon size={18} />
							</a>
							<a
								className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-800 text-stone-400 transition-all hover:border-primary hover:bg-primary hover:text-white"
								href="#"
							>
								<FacebookIcon size={18} />
							</a>
						</div>
					</div>

					<div>
						<h4 className="mb-6 font-bold text-primary">Quick Links</h4>
						<ul className="flex flex-col gap-4 text-sm">
							<li>
								<a className="transition-colors hover:text-primary" href="#">
									Our Story
								</a>
							</li>
							<li>
								<a className="transition-colors hover:text-primary" href="#">
									Track Order
								</a>
							</li>
							<li>
								<a className="transition-colors hover:text-primary" href="#">
									Shipping Policy
								</a>
							</li>
							<li>
								<a className="transition-colors hover:text-primary" href="#">
									Return Policy
								</a>
							</li>
							<li>
								<a className="transition-colors hover:text-primary" href="#">
									Contact Us
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="mb-6 font-bold text-primary">Categories</h4>
						<ul className="flex flex-col gap-4 text-sm">
							<li>
								<a className="transition-colors hover:text-primary" href="#">
									Islamic Books
								</a>
							</li>
							<li>
								<a className="transition-colors hover:text-primary" href="#">
									Personal Development
								</a>
							</li>
							<li>
								<a className="transition-colors hover:text-primary" href="#">
									Biographies
								</a>
							</li>
							<li>
								<a className="transition-colors hover:text-primary" href="#">
									Children's Books
								</a>
							</li>
							<li>
								<a className="transition-colors hover:text-primary" href="#">
									New Releases
								</a>
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
					<p className="text-xm">© 2024 Rewaya Books. All rights reserved.</p>
					<div className="flex gap-6 font-bold text-xm">
						<a className="transition-colors hover:text-white" href="/privacy">
							Privacy Policy
						</a>
						<a className="transition-colors hover:text-white" href="/terms">
							Terms of Service
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
