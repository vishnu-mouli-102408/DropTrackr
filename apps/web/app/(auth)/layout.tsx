import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session) {
		const returnTo = (await headers()).get("referer") || "/dashboard";
		redirect(returnTo);
	}

	return <>{children}</>;
}
