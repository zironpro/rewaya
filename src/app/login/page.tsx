import Link from "next/link";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
	return (
		<div className="flex min-h-screen flex-col bg-white">
			<Navbar />

			<main className="flex grow items-center justify-center px-6 py-32">
				<div className="w-full max-w-md">
					<div className="mb-12 text-center">
						<span className="mb-4 block font-bold text-[10px] text-stone-400 uppercase tracking-[0.4em]">
							Welcome Back
						</span>
						<h1 className="mb-4 font-black font-serif text-5xl">
							LOG <span className="font-normal italic">IN</span>.
						</h1>
						<p className="font-bold text-stone-500 text-xs uppercase tracking-widest">
							Enter your credentials to access your library.
						</p>
					</div>

					<form className="space-y-8">
						<div className="space-y-2">
							<label className="font-bold text-[10px] text-stone-400 uppercase tracking-[0.2em]">
								Email Address
							</label>
							<Input placeholder="EMAIL@EXAMPLE.COM" required type="email" />
						</div>

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<label className="font-bold text-[10px] text-stone-400 uppercase tracking-[0.2em]">
									Password
								</label>
								<Link
									className="font-bold text-[9px] text-stone-300 uppercase tracking-widest transition-colors hover:text-primary"
									href="#"
								>
									Forgot Password?
								</Link>
							</div>
							<Input placeholder="••••••••" required type="password" />
						</div>

						<Button className="h-14 w-full" variant="premium">
							Sign In
						</Button>
					</form>

					<div className="mt-12 border-stone-100 border-t pt-8 text-center">
						<p className="font-bold text-[10px] text-stone-400 uppercase tracking-widest">
							Don't have an account?{" "}
							<Link
								className="ml-2 text-black transition-colors hover:text-primary"
								href="/signup"
							>
								Create Account
							</Link>
						</p>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
