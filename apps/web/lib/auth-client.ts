import { createAuthClient } from "better-auth/react";

type AuthClient = ReturnType<typeof createAuthClient>;
export const authClient: AuthClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
});
