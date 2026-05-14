import Image from "next/image";

export const Logo = () => {
	return (
		<div className="flex shrink-0 items-center gap-3">
			<Image
				alt="Al Rewaya Logo"
				className="h-11 w-auto object-contain"
				height={64}
				src="/logo.png"
				width={260}
			/>
			<div className="hidden flex-col leading-none xl:flex">
				<span className="font-bold font-display text-secondary text-xl tracking-tight">
					Al Rewaya
				</span>
				<span className="font-semibold text-primary text-xs uppercase tracking-widest">
					Book World
				</span>
			</div>
		</div>
	);
};
