"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { VerificationForm } from "@/features/auth/verification-form";
import { useWixAuth } from "@/lib/wix/provider";

export const LoginView = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const returnUrl = searchParams.get("returnUrl") ?? "/profile";

	const {
		isReady,
		isLoggedIn,
		isPending,
		error,
		needsVerification,
		clearError,
		loginWithEmail,
		verifyEmail,
		startWixLogin,
		sendPasswordReset,
	} = useWixAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [resetSent, setResetSent] = useState(false);

	useEffect(() => {
		if (isReady && isLoggedIn) {
			router.replace(returnUrl);
		}
	}, [isReady, isLoggedIn, returnUrl, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		clearError();
		const result = await loginWithEmail(email.trim(), password);
		if (result.status === "success") {
			router.push(returnUrl);
		}
	};

	const handleVerify = async (code: string) => {
		clearError();
		const result = await verifyEmail(code);
		if (result.status === "success") {
			router.push(returnUrl);
		}
	};

	const handleForgotPassword = async () => {
		if (!email.trim()) {
			return;
		}
		clearError();
		setResetSent(false);
		await sendPasswordReset(email.trim());
		setResetSent(true);
	};

	if (!isReady) {
		return (
			<main className="flex min-h-svh grow items-center justify-center px-4">
				<p className="font-bold text-secondary text-sm">Loading…</p>
			</main>
		);
	}

	return (
		<main className="flex min-h-svh grow items-center justify-center px-4">
			<div className="w-full max-w-md rounded-md border border-stone-100 bg-white p-8">
				<div className="mb-12 text-center">
					<h1 className="font-bold font-serif text-3xl sm:text-4xl">
						Log <span className="font-normal italic">In</span>.
					</h1>
				</div>

				<div className="mb-10 space-y-6">
					<div className="flex flex-col gap-4 sm:flex-row">
						<Button
							className="flex-1 gap-3"
							disabled={isPending}
							onClick={() => startWixLogin(returnUrl)}
							type="button"
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
							className="flex-1 gap-3"
							disabled={isPending}
							onClick={() => startWixLogin(returnUrl)}
							type="button"
							variant="outline"
						>
							<svg className="size-4 fill-[#1877F2]" viewBox="0 0 24 24">
								<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
							</svg>
							Facebook
						</Button>
					</div>

					<div className="relative flex items-center justify-center">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<p className="relative flex justify-center font-medium text-xs tracking-tight">
							<span className="bg-white px-4 text-secondary/60">
								Or continue with email
							</span>
						</p>
					</div>
				</div>

				{error && (
					<p className="mb-4 text-center text-red-600 text-sm">{error}</p>
				)}
				{resetSent && (
					<p className="mb-4 text-center text-green-700 text-sm">
						Password reset email sent. Check your inbox.
					</p>
				)}

				{needsVerification ? (
					<VerificationForm isPending={isPending} onSubmit={handleVerify} />
				) : (
					<form className="space-y-8" onSubmit={handleSubmit}>
						<div className="space-y-2">
							<label
								className="font-bold text-secondary text-sm"
								htmlFor="login-email"
							>
								Email Address
							</label>
							<Input
								id="login-email"
								onChange={(e) => setEmail(e.target.value)}
								placeholder="email@example.com"
								required
								type="email"
								value={email}
							/>
						</div>

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<label
									className="font-bold text-secondary text-sm"
									htmlFor="login-password"
								>
									Password
								</label>
								<button
									className="font-bold text-secondary/60 text-sm transition-colors hover:text-primary"
									onClick={handleForgotPassword}
									type="button"
								>
									Forgot Password?
								</button>
							</div>
							<Input
								id="login-password"
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								required
								type="password"
								value={password}
							/>
						</div>

						<Button className="w-full" disabled={isPending} type="submit">
							{isPending ? "Signing in…" : "Sign In"}
						</Button>
					</form>
				)}

				<div className="mt-12 border-stone-100 border-t pt-8 text-center">
					<p className="font-bold text-secondary/60 text-sm">
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
};
