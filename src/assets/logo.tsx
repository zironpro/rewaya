import Image from "next/image";

export const Logo = () => {
	return (
		<Image
			alt="Al Rewaya Logo"
			className="h-11 w-auto object-contain"
			height={44}
			src="/rewaya-logo.svg"
			width={176}
		/>
	);
};
