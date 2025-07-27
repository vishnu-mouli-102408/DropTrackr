import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	// Client-side configuration
	baseURL: "http://localhost:3000",
});
