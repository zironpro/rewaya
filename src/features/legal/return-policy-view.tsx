import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const ReturnPolicyView = () => {
	return (
		<main className="grow pt-6 pb-28 md:pb-16">
			<div className="container">
				<Breadcrumbs className="mb-6" items={[{ label: "Return Policy" }]} />

				<div className="mx-auto max-w-3xl">
					<span className="mb-6 block font-semibold text-muted-foreground text-sm">
						Legal Information
					</span>
					<h1 className="mb-12 font-black font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
						Return & <span className="font-normal italic">Policy</span>.
					</h1>

					<div className="prose prose-stone max-w-none space-y-12">
						<section>
							<h2 className="mb-6 font-serif text-3xl text-secondary">
								1. Agreement to Return Policy
							</h2>
							<p className="text-lg text-stone-500 leading-relaxed">
								By accessing or using the Al Rewaya platform, you agree to be
								bound by these Return Policy. If you do not agree with any part
								of these terms, you must not use our services.
							</p>
						</section>

						<section>
							<h2 className="mb-6 font-serif text-3xl text-secondary">
								2. Return Policy
							</h2>
							<p className="text-lg text-stone-500 leading-relaxed">
								All returns must be made within 7 days of receiving your order.
								All returns must be in the original condition and packaging. All
								returns must be accompanied by a receipt.
							</p>
						</section>

						<section>
							<h2 className="mb-6 font-serif text-3xl text-secondary">
								3. Return Policy
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
