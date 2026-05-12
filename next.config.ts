import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactCompiler: true,
	experimental: {
		turbopackFileSystemCacheForBuild: true,
		turbopackFileSystemCacheForDev: true,
	},

	images: {
		remotePatterns: [{ hostname: "images.unsplash.com" }],
	},
};

export default nextConfig;
