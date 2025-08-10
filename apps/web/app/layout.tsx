import type { Metadata } from "next";
import "@repo/ui/globals.css";
import { Toaster } from "@repo/ui/components/sonner";
import { Providers } from "../components/global/providers";
import { cn } from "@repo/ui/lib/utils";

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
		<html suppressHydrationWarning lang="en" className={cn("dark min-h-screen overflow-x-hidden antialiased")}>
			<body className={"antialiased dark min-h-screen overflow-x-hidden"}>
				<main className="relative flex flex-col">
					<Providers>{children}</Providers>
					<Toaster closeButton position="bottom-center" theme="dark" richColors />
				</main>
			</body>
		</html>
	);
}
