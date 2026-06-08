import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typescript: {
		// Allow production builds even if TypeScript reports type errors
		ignoreBuildErrors: true,
	},
	reactCompiler: true,
	experimental: {
		turbopackFileSystemCacheForBuild: true,
		turbopackFileSystemCacheForDev: true,
	},

	images: {
		remotePatterns: [
			{ hostname: "images.unsplash.com" },
			{ hostname: "static.wixstatic.com" },
		],
	},
};

export default nextConfig;
