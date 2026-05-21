import Image from "next/image";

export const BookMosaic = () => {
	return (
		<div className="absolute inset-0 grid grid-cols-3 gap-12 p-12">
			<Image
				alt="Book 1"
				className="rounded-sm shadow-sm transition-[box-shadow_scale] hover:scale-105 hover:shadow-md"
				height={340}
				src="/products/book-1.jpg"
				width={200}
			/>
			<div />
			<Image
				alt="Book 1"
				className="place-self-end rounded-sm shadow-sm transition-[box-shadow_scale] hover:scale-105 hover:shadow-md"
				height={340}
				src="/products/book-2.jpg"
				width={200}
			/>
			<Image
				alt="Book 1"
				className="rounded-sm shadow-sm transition-[box-shadow_scale] hover:scale-105 hover:shadow-md"
				height={340}
				src="/products/book-3.jpg"
				width={200}
			/>
			<div />
			<Image
				alt="Book 1"
				className="place-self-end rounded-sm shadow-sm transition-[box-shadow_scale] hover:scale-105 hover:shadow-md"
				height={340}
				src="/products/book-4.jpg"
				width={200}
			/>
		</div>
	);
};
