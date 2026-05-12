import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				className={cn(
					"flex h-12 w-full border-stone-200 border-b bg-transparent px-0 py-4 font-bold text-xs uppercase tracking-widest ring-offset-background transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-stone-300 focus-visible:border-black focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
					className
				)}
				ref={ref}
				type={type}
				{...props}
			/>
		);
	}
);
Input.displayName = "Input";

export { Input };
