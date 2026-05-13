import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
	return (
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

				<div className="mt-8 space-y-6">
					<div className="relative flex items-center justify-center">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-stone-100 border-t" />
						</div>
						<div className="relative flex justify-center font-bold text-[10px] uppercase tracking-[0.3em]">
							<span className="bg-white px-4 text-stone-300">Or continue with</span>
						</div>
					</div>

					<div className="flex gap-4">
						<Button
							className="h-12 flex-1 gap-3 rounded-xl border-stone-100 font-bold text-[#1E2147] text-[10px] uppercase tracking-widest transition-colors hover:bg-stone-50"
							variant="outline"
						>
							<svg className="size-4" viewBox="0 0 24 24">
								<path
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									fill="#4285F4"
								/>
								<path
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									fill="#34A853"
								/>
								<path
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
									fill="#FBBC05"
								/>
								<path
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
									fill="#EA4335"
								/>
							</svg>
							Google
						</Button>
						<Button
							className="h-12 flex-1 gap-3 rounded-xl border-stone-100 font-bold text-[#1E2147] text-[10px] uppercase tracking-widest transition-colors hover:bg-stone-50"
							variant="outline"
						>
							<svg className="size-4 fill-[#1877F2]" viewBox="0 0 24 24">
								<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
							</svg>
							Facebook
						</Button>
					</div>
				</div>

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
	);
}
