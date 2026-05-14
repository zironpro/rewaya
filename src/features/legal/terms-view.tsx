"use client";

import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const TermsView = () => {
	return (
		<main className="grow pt-20 pb-32">
			<div className="container mx-auto px-6">
				<Breadcrumbs
					className="mb-12"
					items={[{ label: "Terms and Conditions" }]}
				/>

				<div className="mx-auto max-w-3xl">
					<span className="mb-6 block font-bold text-sm text-stone-400 uppercase tracking-widest">
						Legal Information
					</span>
					<h1 className="mb-12 font-black font-serif text-5xl md:text-7xl">
						Terms & <span className="font-normal italic">Conditions</span>.
					</h1>

					<div className="prose prose-stone max-w-none space-y-12">
						<section>
							<h2 className="mb-6 font-serif text-3xl text-secondary">
								1. Agreement to Terms
							</h2>
							<p className="text-lg text-stone-500 leading-relaxed">
								By accessing or using the Al Rewaya platform, you agree to be
								bound by these Terms and Conditions. If you do not agree with
								any part of these terms, you must not use our services.
							</p>
						</section>

						<section>
							<h2 className="mb-6 font-serif text-3xl text-secondary">
								2. Intellectual Property
							</h2>
							<p className="text-lg text-stone-500 leading-relaxed">
								The content, design, and identity of Al Rewaya are the exclusive
								property of Al Rewaya. You may not reproduce, distribute, or
								create derivative works from any part of our platform without
								explicit written permission.
							</p>
						</section>

						<section>
							<h2 className="mb-6 font-serif text-3xl text-secondary">
								3. User Accounts
							</h2>
							<p className="text-lg text-stone-500 leading-relaxed">
								When you create an account with us, you must provide accurate
								and complete information. You are responsible for maintaining
								the confidentiality of your account and password.
							</p>
						</section>

						<section>
							<h2 className="mb-6 font-serif text-3xl text-secondary">
								4. Purchases and Payment
							</h2>
							<p className="text-lg text-stone-500 leading-relaxed">
								All prices are in AED unless otherwise stated. We reserve the
								right to change prices at any time without notice. By placing an
								order, you represent that you have the legal right to use the
								chosen payment method.
							</p>
						</section>

						<section>
							<h2 className="mb-6 font-serif text-3xl text-secondary">
								5. Limitation of Liability
							</h2>
							<p className="text-lg text-stone-500 leading-relaxed">
								Al Rewaya shall not be liable for any indirect, incidental,
								special, consequential, or punitive damages resulting from your
								access to or use of our platform or products.
							</p>
						</section>

						<div className="mt-20 border-stone-100 border-t pt-12 text-stone-400">
							<p>Last updated: May 14, 2026</p>
							<p className="mt-2">Legal Team: legal@alrewaya.com</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};
