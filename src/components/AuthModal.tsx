"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";

import { authModalAtom } from "@/lib/store";

export default function AuthModal() {
	const [modalState, setModalState] = useAtom(authModalAtom);
	const [view, setView] = useState<"login" | "signup">(modalState.view);
	const [showEmailForm, setShowEmailForm] = useState(false);

	const closePortal = () => setModalState({ ...modalState, isOpen: false });

	return (
		<Dialog
			onOpenChange={(open) => setModalState({ ...modalState, isOpen: open })}
			open={modalState.isOpen}
		>
			<DialogContent className="overflow-hidden rounded-4xl border-none bg-white p-0 shadow-2xl sm:max-w-[480px] [&>button]:hidden">
				<div className="relative flex flex-col items-center p-8 md:p-10">
					{/* Large Close Icon */}
					<button
						className="absolute top-6 right-6 z-10 text-stone-300 transition-colors hover:text-primary"
						onClick={closePortal}
					>
						<X size={28} strokeWidth={1.5} />
					</button>

					{/* Header */}
					<div className="mb-6 flex flex-col items-center text-center">
						<img
							alt="Rewaya"
							className="mb-6 h-10"
							src="/Al%20Rewaya%20Book%20World%20Approved%20Logo%201%20-%20Copy.png"
						/>
						<DialogTitle className="mb-1 font-black font-serif text-3xl text-[#1E2147] uppercase tracking-[0.1em] md:text-4xl">
							{view === "login" ? "Welcome Back" : "Join the Seekers"}
						</DialogTitle>
						<DialogDescription className="font-black text-[10px] text-stone-400 uppercase tracking-[0.3em]">
							{view === "login"
								? "Sign in to your library"
								: "Create your rewaya account"}
						</DialogDescription>
					</div>

					{/* Toggle Switch */}
					<div className="mb-8 flex w-full max-w-[320px] rounded-2xl bg-stone-50 p-1.5">
						<button
							className={`flex-1 rounded-xl py-3 font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
								view === "login"
									? "bg-white text-[#1E2147] shadow-md"
									: "text-stone-300 hover:text-stone-400"
							}`}
							onClick={() => {
								setView("login");
								setShowEmailForm(false);
							}}
						>
							Sign In
						</button>
						<button
							className={`flex-1 rounded-xl py-3 font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
								view === "signup"
									? "bg-white text-[#1E2147] shadow-md"
									: "text-stone-300 hover:text-stone-400"
							}`}
							onClick={() => setView("signup")}
						>
							Sign Up
						</button>
					</div>

					<AnimatePresence mode="wait">
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							className="w-full"
							exit={{ opacity: 0, y: -10 }}
							initial={{ opacity: 0, y: 10 }}
							key={view + showEmailForm}
						>
							{view === "login" && !showEmailForm ? (
								<div className="space-y-4">
									<Button
										className="h-14 w-full gap-4 rounded-xl border-stone-100 font-black text-[#1E2147] text-[11px] uppercase tracking-widest hover:bg-stone-50"
										variant="outline"
									>
										<img
											alt="Google"
											className="h-5 w-5"
											src="https://www.google.com/favicon.ico"
										/>
										Log in with Google
									</Button>
									<Button className="h-14 w-full gap-4 rounded-xl border-none bg-[#1877F2] font-black text-[11px] text-white uppercase tracking-widest hover:bg-[#1877F2]/90">
										<svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
											<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
										</svg>
										Log in with Facebook
									</Button>
									<div className="relative py-6">
										<div className="absolute inset-0 flex items-center">
											<span className="w-full border-stone-100 border-t" />
										</div>
										<div className="relative flex justify-center font-black text-[10px] uppercase tracking-widest">
											<span className="bg-white px-4 text-stone-300">or</span>
										</div>
									</div>
									<Button
										className="h-14 w-full rounded-xl border-primary/20 font-black text-[11px] text-primary uppercase tracking-widest hover:bg-primary/5"
										onClick={() => setShowEmailForm(true)}
										variant="outline"
									>
										Log in with Email
									</Button>
								</div>
							) : (
								<form className="space-y-4">
									{(view === "signup" ||
										(view === "login" && showEmailForm)) && (
										<>
											{view === "signup" && (
												<div className="group relative">
													<label className="mb-2 block font-bold text-[#1E2147]/40 text-xs uppercase tracking-[0.2em] transition-colors group-focus-within:text-[#1E2147]">
														Name
													</label>
													<input
														className="w-full border-stone-200 border-b bg-transparent py-2 font-medium text-[#1E2147] text-sm outline-none transition-all focus:border-[#1E2147]"
														type="text"
													/>
												</div>
											)}
											<div className="group relative">
												<label className="mb-2 block font-bold text-[#1E2147]/40 text-xs uppercase tracking-[0.2em] transition-colors group-focus-within:text-[#1E2147]">
													Email
												</label>
												<input
													className="w-full border-stone-200 border-b bg-transparent py-2 font-medium text-[#1E2147] text-sm outline-none transition-all focus:border-[#1E2147]"
													type="email"
												/>
											</div>
											<div className="group relative">
												<label className="mb-2 block font-bold text-[#1E2147]/40 text-xs uppercase tracking-[0.2em] transition-colors group-focus-within:text-[#1E2147]">
													Password
												</label>
												<input
													className="w-full border-stone-200 border-b bg-transparent py-2 font-medium text-[#1E2147] text-sm outline-none transition-all focus:border-[#1E2147]"
													type="password"
												/>
											</div>

											<div className="flex items-center justify-between">
												<button
													className="font-black text-[10px] text-stone-300 uppercase tracking-widest underline decoration-stone-200 underline-offset-4 transition-colors hover:text-[#1E2147]"
													type="button"
												>
													Forgot password?
												</button>
											</div>

											<Button className="h-14 w-full rounded-none bg-[#94B0A9] font-black text-[11px] text-white uppercase tracking-[0.4em] shadow-xl transition-all hover:bg-[#7A918B]">
												{view === "login" ? "Log In" : "Get Started"}
											</Button>

											{view === "login" && showEmailForm && (
												<button
													className="mt-2 w-full font-black text-[10px] text-stone-200 uppercase tracking-widest transition-colors hover:text-primary"
													onClick={() => setShowEmailForm(false)}
												>
													← Back to Social Logins
												</button>
											)}
										</>
									)}
								</form>
							)}
						</motion.div>
					</AnimatePresence>

					{/* Social Footer Icons (Only shown when email form is visible to keep consistency) */}
					{view === "login" && showEmailForm && (
						<div className="mt-6 w-full">
							<div className="relative mb-4 flex items-center justify-center">
								<div className="absolute h-px w-full bg-stone-100" />
								<span className="relative bg-white px-6 font-medium text-[10px] text-stone-300 lowercase italic tracking-wider">
									or log in with
								</span>
							</div>
							<div className="flex justify-center gap-6">
								<button className="group rounded-full border border-stone-100 p-3 transition-all hover:bg-stone-50">
									<img
										alt="Google"
										className="h-5 w-5 grayscale transition-all group-hover:grayscale-0"
										src="https://www.google.com/favicon.ico"
									/>
								</button>
								<button className="group rounded-full border border-stone-100 p-3 transition-all hover:bg-stone-50">
									<svg
										className="h-5 w-5 fill-current text-stone-300 transition-all group-hover:text-[#1877F2]"
										viewBox="0 0 24 24"
									>
										<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
									</svg>
								</button>
							</div>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
