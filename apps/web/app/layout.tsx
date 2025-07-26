import type { Metadata } from "next";
import localFont from "next/font/local";
import "@repo/ui/globals.css";
import { Toaster } from "@repo/ui/components/sonner";
import { Providers } from "../components/global/providers";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
});

export const metadata: Metadata = {
	title: "Image Generator",
	description: "Image Generator",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<main className="relative flex flex-col">
					<Providers>{children}</Providers>
					<Toaster closeButton position="bottom-center" theme="dark" richColors />
				</main>
			</body>
		</html>
	);
}
