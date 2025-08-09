"use server";

import { headers } from "next/headers";

export const getUser = async () => {
	try {
		const user = await fetch("http://localhost:8080/api/me", {
			method: "GET",
			credentials: "include",
			headers: await headers(),
		});
		const data = await user.json();
		return data;
	} catch (error) {
		console.error("Error fetching user:", error);
	}
};
