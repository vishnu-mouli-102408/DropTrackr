import type { Metadata } from "next";
import "@repo/ui/globals.css";
import { Toaster } from "@repo/ui/components/sonner";
import { Providers } from "../components/global/providers";

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
			<body className={"antialiased dark min-h-screen overflow-x-hidden"}>
				<main className="relative flex flex-col">
					<Providers>{children}</Providers>
					<Toaster closeButton position="bottom-center" theme="dark" richColors />
				</main>
			</body>
		</html>
	);
}
