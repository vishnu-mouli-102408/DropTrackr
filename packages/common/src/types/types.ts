import { z } from "zod";

export const uploadRequestSchema = z.object({
	filename: z.string(),
	contentType: z.string(),
	size: z.number(),
});

export const deleteFileRequestSchema = z.object({
	key: z.string(),
});
