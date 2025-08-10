/** @type {import('next').NextConfig} */
const nextConfig = {
	compiler: {
		// eslint-disable-next-line no-undef
		removeConsole: process.env.NODE_ENV !== "development",
	},
};

export default nextConfig;
