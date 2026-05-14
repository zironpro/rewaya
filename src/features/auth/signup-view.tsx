import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const SignupView = () => {
	return (
		<main className="flex grow items-center justify-center px-6 py-32">
			<div className="w-full max-w-md rounded-[2.5rem] border border-stone-100 bg-white p-8 shadow-sm md:p-12">
				<div className="mb-12 text-center">
					<span className="mb-4 block font-bold text-secondary text-sm">
						Join the Circle
					</span>
					<h1 className="mb-4 font-black font-serif text-5xl">
						Sign <span className="font-normal italic">Up</span>.
					</h1>
					<p className="font-bold text-secondary/60 text-sm">
						Become a part of our global community of seekers.
					</p>
				</div>

				<form className="space-y-6">
					<div className="space-y-2">
						<label className="font-bold text-secondary text-sm">
							Full Name
						</label>
						<Input placeholder="Full Name" required type="text" />
					</div>

					<div className="space-y-2">
						<label className="font-bold text-secondary text-sm">
							Email Address
						</label>
						<Input placeholder="email@example.com" required type="email" />
					</div>

					<div className="space-y-2">
						<label className="font-bold text-secondary text-sm">Password</label>
						<Input placeholder="••••••••" required type="password" />
					</div>

					<p className="py-4 text-center text-secondary/60 text-sm leading-relaxed">
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
					<Link
						className="mt-4 flex items-center justify-center gap-2 font-bold text-secondary text-sm transition-colors hover:text-primary"
						href="/"
					>
						Explore without login
					</Link>
				</form>

				<div className="mt-12 border-stone-100 border-t pt-8 text-center">
					<p className="font-bold text-secondary/60 text-sm">
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
	);
};
