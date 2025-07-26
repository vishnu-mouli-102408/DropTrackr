"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@repo/ui/components/button";
import { Spinner } from "@repo/ui/global/spinner";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Logout() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const handleLogout = async () => {
		setLoading(true);
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					setLoading(false);
					router.push("/");
				},
			},
		});
	};

	return (
		<Button
			variant="destructive"
			onClick={handleLogout}
			disabled={loading}
			className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-destructive/90"
		>
			{loading ? (
				<Spinner variant="circle" className="size-4" />
			) : (
				<>
					<span className="font-medium">Logout</span>
					<LogOut className="size-4" />
				</>
			)}
		</Button>
	);
}
