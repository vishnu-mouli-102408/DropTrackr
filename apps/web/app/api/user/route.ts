import { NextResponse } from "next/server";

export async function GET() {
	try {
		const session = await fetch("http://localhost:8080/api/me", {
			method: "GET",
			credentials: "include",
		});
		if (!session.ok) {
			throw new Error("Failed to fetch user");
		}
		const data = await session.json();
		return NextResponse.json({ user: data.user });
	} catch (error) {
		console.error("Error in user route:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
