import { z } from "zod";

export const uploadRequestSchema = z.object({
	filename: z.string(),
	contentType: z.string(),
	size: z.number(),
});
