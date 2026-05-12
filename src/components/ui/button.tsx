import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap font-bold text-[10px] uppercase tracking-[0.2em] ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				default: "bg-primary text-white hover:bg-primary-dark",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/90",
				outline:
					"border border-stone-200 bg-transparent hover:border-primary hover:bg-stone-50 hover:text-primary",
				secondary: "bg-stone-100 text-stone-900 hover:bg-stone-200",
				ghost: "hover:bg-stone-100 hover:text-primary",
				link: "text-primary underline-offset-4 hover:underline",
				premium:
					"transform bg-primary text-white shadow-heavy hover:-translate-y-0.5 hover:bg-primary-dark",
			},
			size: {
				default: "h-14 px-10 py-2",
				sm: "h-10 px-6",
				lg: "h-16 px-12 text-[11px]",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	}
);
Button.displayName = "Button";

export { Button, buttonVariants };
