"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { VerificationForm } from "@/features/auth/verification-form";
import { useWixAuth } from "@/lib/wix/provider";

export const SignupView = () => {
	const router = useRouter();
	const {
		isReady,
		isLoggedIn,
		isPending,
		error,
		needsVerification,
		clearError,
		registerWithEmail,
		verifyEmail,
	} = useWixAuth();

	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	useEffect(() => {
		if (isReady && isLoggedIn) {
			router.replace("/profile");
		}
	}, [isReady, isLoggedIn, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		clearError();
		const result = await registerWithEmail(
			email.trim(),
			password,
			fullName.trim()
		);
		if (result.status === "success") {
			router.push("/profile");
		}
	};

	const handleVerify = async (code: string) => {
		clearError();
		const result = await verifyEmail(code);
		if (result.status === "success") {
			router.push("/profile");
		}
	};

	if (!isReady) {
		return (
			<main className="flex grow items-center justify-center px-4 py-16 sm:py-24">
				<p className="font-bold text-secondary text-sm">Loading…</p>
			</main>
		);
	}

	return (
		<main className="flex min-h-svh grow items-center justify-center px-4">
			<div className="w-full max-w-md rounded-md border border-stone-100 bg-white p-8 shadow-sm md:p-6">
				<div className="mb-12 text-center">
					<span className="mb-4 block font-bold text-secondary text-sm">
						Join the Circle
					</span>
					<h1 className="mb-4 font-bold font-serif text-3xl sm:text-4xl">
						Sign <span className="font-normal italic">Up</span>.
					</h1>
					<p className="font-bold text-secondary/60 text-sm">
						Become a part of our global community of seekers.
					</p>
				</div>

				{error && (
					<p className="mb-4 text-center text-red-600 text-sm">{error}</p>
				)}

				{needsVerification ? (
					<VerificationForm isPending={isPending} onSubmit={handleVerify} />
				) : (
					<form className="space-y-6" onSubmit={handleSubmit}>
						<div className="space-y-2">
							<label
								className="font-bold text-secondary text-sm"
								htmlFor="signup-name"
							>
								Full Name
							</label>
							<Input
								id="signup-name"
								onChange={(e) => setFullName(e.target.value)}
								placeholder="Full Name"
								required
								type="text"
								value={fullName}
							/>
						</div>

						<div className="space-y-2">
							<label
								className="font-bold text-secondary text-sm"
								htmlFor="signup-email"
							>
								Email Address
							</label>
							<Input
								id="signup-email"
								onChange={(e) => setEmail(e.target.value)}
								placeholder="email@example.com"
								required
								type="email"
								value={email}
							/>
						</div>

						<div className="space-y-2">
							<label
								className="font-bold text-secondary text-sm"
								htmlFor="signup-password"
							>
								Password
							</label>
							<Input
								id="signup-password"
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								required
								type="password"
								value={password}
							/>
						</div>

						<Button className="w-full" disabled={isPending} type="submit">
							{isPending ? "Creating account…" : "Create Account"}
						</Button>
					</form>
				)}

				<div className="mt-9 border-stone-100 border-t pt-8 text-center">
					<p className="font-bold text-secondary/60 text-sm">
						Already have an account?{" "}
						<Link
							className="ml-2 text-black transition-colors hover:text-primary"
							href="/login"
						>
							Log In
						</Link>
					</p>
					<p className="py-4 text-center text-secondary/60 text-xs leading-relaxed">
						By creating an account, you agree to our <br />
						<Link className="underline hover:text-black" href="/terms">
							Terms of Service
						</Link>{" "}
						and{" "}
						<Link className="underline hover:text-black" href="/privacy">
							Privacy Policy
						</Link>
						.
					</p>
				</div>
			</div>
		</main>
	);
};
