import type { Metadata } from "next";
import "@repo/ui/globals.css";
import { Toaster } from "@repo/ui/components/sonner";
import { Providers } from "../components/global/providers";
import { cn } from "@repo/ui/lib/utils";

export const metadata: Metadata = {
	title: "DropTrackr – Instant File Drops",
	description:
		"Send files instantly with expiring links, password protection, and real-time analytics — all in one simple, secure platform.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html suppressHydrationWarning lang="en" className={cn("dark min-h-screen overflow-x-hidden antialiased")}>
			<head>
				<link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
				<link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
				<link rel="shortcut icon" href="/favicon/favicon.ico" />
				<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
				<link rel="manifest" href="/favicon/site.webmanifest" />
			</head>
			<body className={"antialiased dark min-h-screen overflow-x-hidden"}>
				<main className="relative flex flex-col">
					<Providers>{children}</Providers>
					<Toaster closeButton position="bottom-center" theme="dark" richColors />
				</main>
			</body>
		</html>
	);
}
