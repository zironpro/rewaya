import Link from "next/link";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
	return (
		<div className="flex min-h-screen flex-col bg-white">
			<Navbar />

			<main className="flex grow items-center justify-center px-6 py-32">
				<div className="w-full max-w-md">
					<div className="mb-12 text-center">
						<span className="mb-4 block font-bold text-[10px] text-stone-400 uppercase tracking-[0.4em]">
							Join the Circle
						</span>
						<h1 className="mb-4 font-black font-serif text-5xl">
							SIGN <span className="font-normal italic">UP</span>.
						</h1>
						<p className="font-bold text-stone-500 text-xs uppercase tracking-widest">
							Become a part of our global community of seekers.
						</p>
					</div>

					<form className="space-y-6">
						<div className="space-y-2">
							<label className="font-bold text-[10px] text-stone-400 uppercase tracking-[0.2em]">
								Full Name
							</label>
							<Input placeholder="YOUR NAME" required type="text" />
						</div>

						<div className="space-y-2">
							<label className="font-bold text-[10px] text-stone-400 uppercase tracking-[0.2em]">
								Email Address
							</label>
							<Input placeholder="EMAIL@EXAMPLE.COM" required type="email" />
						</div>

						<div className="space-y-2">
							<label className="font-bold text-[10px] text-stone-400 uppercase tracking-[0.2em]">
								Password
							</label>
							<Input placeholder="••••••••" required type="password" />
						</div>

						<p className="py-4 text-center text-[9px] text-stone-400 uppercase leading-relaxed tracking-widest">
							By creating an account, you agree to our <br />
							<Link className="underline hover:text-black" href="#">
								Terms of Service
							</Link>{" "}
							and{" "}
							<Link className="underline hover:text-black" href="#">
								Privacy Policy
							</Link>
							.
						</p>

						<Button className="h-14 w-full" variant="premium">
							Create Account
						</Button>
					</form>

					<div className="mt-12 border-stone-100 border-t pt-8 text-center">
						<p className="font-bold text-[10px] text-stone-400 uppercase tracking-widest">
							Already have an account?{" "}
							<Link
								className="ml-2 text-black transition-colors hover:text-primary"
								href="/login"
							>
								Log In
							</Link>
						</p>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
