import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
	return (
		<div className="flex min-h-screen flex-col bg-white">
			<Navbar />

			<main className="grow pt-32">
				<div className="container mx-auto px-6">
					<div className="mb-32 grid grid-cols-1 gap-32 lg:grid-cols-2">
						{/* Contact Info */}
						<div className="flex flex-col justify-between py-12">
							<div>
								<span className="mb-12 block font-bold text-[10px] text-stone-400 uppercase tracking-[0.4em]">
									Get in Touch
								</span>
								<h1 className="mb-16 font-black font-serif text-6xl leading-[0.85] md:text-8xl">
									LET'S <br />
									<span className="font-normal text-stone-300 italic">
										CONNECT.
									</span>
								</h1>

								<div className="space-y-12">
									<div>
										<h3 className="mb-4 font-bold text-[10px] text-stone-400 uppercase tracking-[0.2em]">
											Email Us
										</h3>
										<p className="font-serif text-2xl">hello@rewayabooks.com</p>
									</div>
									<div>
										<h3 className="mb-4 font-bold text-[10px] text-stone-400 uppercase tracking-[0.2em]">
											Visit Us
										</h3>
										<p className="font-serif text-2xl">
											123 Wisdom Ave, <br />
											Knowledge District, NY 10001
										</p>
									</div>
									<div>
										<h3 className="mb-4 font-bold text-[10px] text-stone-400 uppercase tracking-[0.2em]">
											Follow
										</h3>
										<div className="flex gap-8">
											<a
												className="font-bold text-xs uppercase tracking-widest transition-colors hover:text-stone-400"
												href="#"
											>
												Instagram
											</a>
											<a
												className="font-bold text-xs uppercase tracking-widest transition-colors hover:text-stone-400"
												href="#"
											>
												Twitter
											</a>
											<a
												className="font-bold text-xs uppercase tracking-widest transition-colors hover:text-stone-400"
												href="#"
											>
												Pinterest
											</a>
										</div>
									</div>
								</div>
							</div>

							<div className="mt-24 border-stone-100 border-t pt-12">
								<p className="max-w-xs text-[10px] text-stone-400 uppercase leading-loose tracking-[0.2em]">
									Our team typically responds within 24-48 business hours. We
									look forward to hearing your thoughts.
								</p>
							</div>
						</div>

						{/* Contact Form */}
						<div className="bg-stone-50 p-12 md:p-20">
							<form className="space-y-12">
								<div className="space-y-2">
									<label className="font-bold text-[10px] text-stone-400 uppercase tracking-[0.2em]">
										Full Name
									</label>
									<Input placeholder="ENTER YOUR NAME" type="text" />
								</div>

								<div className="space-y-2">
									<label className="font-bold text-[10px] text-stone-400 uppercase tracking-[0.2em]">
										Email Address
									</label>
									<Input placeholder="EMAIL@EXAMPLE.COM" type="email" />
								</div>

								<div className="space-y-2">
									<label className="font-bold text-[10px] text-stone-400 uppercase tracking-[0.2em]">
										Message
									</label>
									<textarea
										className="w-full resize-none border-stone-300 border-b bg-transparent py-4 text-sm uppercase tracking-widest transition-colors focus:border-black focus:outline-none"
										placeholder="WHAT'S ON YOUR MIND?"
										rows={4}
									/>
								</div>

								<Button className="h-16 w-full" variant="premium">
									Send Message
									<span className="ml-4 transform transition-transform group-hover:translate-x-2">
										→
									</span>
								</Button>
							</form>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
