import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { auth } from "@repo/common/server-auth";
import { toNodeHandler } from "better-auth/node";
import { authenticate } from "./middleware";

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(
	cors({
		origin: ["http://localhost:3000"],
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);
app.use(express.json());
app.use("/api", authenticate);

app.get("/api/me", (req, res) => {
	res.json({ user: req.user });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
