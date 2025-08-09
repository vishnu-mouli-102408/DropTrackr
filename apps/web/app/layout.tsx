import type { Metadata } from "next";
import "@repo/ui/globals.css";
import { Toaster } from "@repo/ui/components/sonner";
import { Providers } from "../components/global/providers";
import { Header } from "@/components/header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
	title: "DropTrackr – Instant File Drops",
	description: "DropTrackr – Instant File Drops",
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
					<Header />
					<Providers>{children}</Providers>
					<Footer />
					<Toaster closeButton position="bottom-center" theme="dark" richColors />
				</main>
			</body>
		</html>
	);
}
