import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { auth } from "@repo/common/server-auth";
import { toNodeHandler } from "better-auth/node";
import { authenticate } from "./middleware";
import { TrainModel } from "@repo/common";
import { prisma } from "@repo/db";

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

app.post("api/ai/training", async (req, res) => {
	try {
		const parsedBody = TrainModel.safeParse(req.body);
		if (!parsedBody.success) {
			res.status(411).json({
				message: "Input incorrect",
				error: parsedBody.error,
			});
			return;
		}

		//   const { request_id, response_url } = await falAiModel.trainModel(
		// 	parsedBody.data.zipUrl,
		// 	parsedBody.data.name
		//   );

		const data = await prisma.model.create({
			data: {
				name: parsedBody.data.name,
				type: parsedBody.data.type,
				age: parsedBody.data.age,
				ethinicity: parsedBody.data.ethinicity,
				eyeColor: parsedBody.data.eyeColor,
				bald: parsedBody.data.bald,
				userId: req?.user?.id as string,
				zipUrl: parsedBody.data.zipUrl,
				//   falAiRequestId: request_id,
			},
		});

		res.json({
			modelId: data.id,
		});
	} catch (error) {
		console.error("Error in /ai/training:", error);
		res.status(500).json({
			message: "Training failed",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
