"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VerificationFormProps {
	onSubmit: (code: string) => Promise<void>;
	isPending?: boolean;
}

export function VerificationForm({
	onSubmit,
	isPending = false,
}: VerificationFormProps) {
	const [code, setCode] = useState("");

	return (
		<div className="space-y-4 rounded-xl border border-stone-100 bg-stone-50 p-4">
			<p className="font-bold text-secondary text-sm">
				Enter the verification code sent to your email.
			</p>
			<Input
				autoComplete="one-time-code"
				onChange={(e) => setCode(e.target.value)}
				placeholder="123456"
				required
				type="text"
				value={code}
			/>
			<Button
				className="w-full"
				disabled={isPending || !code.trim()}
				onClick={() => onSubmit(code.trim())}
				type="button"
			>
				{isPending ? "Verifying…" : "Verify email"}
			</Button>
		</div>
	);
}
