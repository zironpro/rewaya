"use client";

import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const PrivacyView = () => {
	return (
		<main className="grow pt-20 pb-32">
			<div className="container mx-auto px-6">
				<Breadcrumbs className="mb-12" items={[{ label: "Privacy Policy" }]} />

				<div className="mx-auto max-w-3xl">
					<span className="mb-6 block font-bold text-sm text-stone-400 uppercase tracking-widest">
						Legal Information
					</span>
					<h1 className="mb-12 font-black font-serif text-5xl md:text-7xl">
						Privacy <span className="font-normal italic">Policy</span>.
					</h1>

					<div className="prose prose-stone max-w-none space-y-12">
						<section>
							<h2 className="mb-6 font-serif text-3xl text-secondary">
								1. Introduction
							</h2>
							<p className="text-lg text-stone-500 leading-relaxed">
								At Al Rewaya, we value your privacy and are committed to
								protecting your personal data. This Privacy Policy outlines how
								we collect, use, and safeguard your information when you visit
								our platform and purchase our curated collections.
							</p>
						</section>

						<section>
							<h2 className="mb-6 font-serif text-3xl text-secondary">
								2. Data Collection
							</h2>
							<p className="text-lg text-stone-500 leading-relaxed">
								We collect information that you provide directly to us when you
								create an account, make a purchase, or subscribe to our
								newsletter. This may include your name, email address, shipping
								address, and payment information.
							</p>
						</section>

						<section>
							<h2 className="mb-6 font-serif text-3xl text-secondary">
								3. How We Use Your Data
							</h2>
							<p className="text-lg text-stone-500 leading-relaxed">
								Your data allows us to process your orders, provide customer
								support, and send you updates about new arrivals and special
								offers. We never sell your personal information to third
								parties.
							</p>
						</section>

						<section>
							<h2 className="mb-6 font-serif text-3xl text-secondary">
								4. Data Security
							</h2>
							<p className="text-lg text-stone-500 leading-relaxed">
								We implement industry-standard security measures to protect your
								data. All payment transactions are processed through secure,
								encrypted gateways to ensure your financial information remains
								private.
							</p>
						</section>

						<section>
							<h2 className="mb-6 font-serif text-3xl text-secondary">
								5. Your Rights
							</h2>
							<p className="text-lg text-stone-500 leading-relaxed">
								You have the right to access, correct, or delete your personal
								information at any time. You can manage your preferences through
								your account settings or by contacting our support team.
							</p>
						</section>

						<div className="mt-20 border-stone-100 border-t pt-12 text-stone-400">
							<p>Last updated: May 14, 2026</p>
							<p className="mt-2">Contact: privacy@alrewaya.com</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};
