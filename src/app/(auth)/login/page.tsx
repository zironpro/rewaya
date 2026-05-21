import { Suspense } from "react";

import { LoginView } from "@/features/auth/login-view";

export default function LoginPage() {
	return (
		<Suspense
			fallback={
				<main className="flex min-h-svh grow items-center justify-center px-4">
					<p className="font-bold text-secondary text-sm">Loading…</p>
				</main>
			}
		>
			<LoginView />
		</Suspense>
	);
}
