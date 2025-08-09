import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { authenticate } from "./middleware";
import { logger, RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW, rateLimiter } from "@repo/common";
import { auth } from "./src/lib/auth";

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();
app.use(
	cors({
		origin: ["http://localhost:3000", "http://localhost:8080"],
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	})
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api", authenticate);
app.use(rateLimiter({ windowInSeconds: RATE_LIMIT_WINDOW, maxRequests: RATE_LIMIT_MAX_REQUESTS }));
app.use(express.json());

app.get("/api/me", (req, res) => {
	logger.info({ user: req.user }, "User:");
	res.json({ user: req.user });
});

app.listen(PORT, () => {
	logger.info(`Server is running on port ${PORT}`);
});
