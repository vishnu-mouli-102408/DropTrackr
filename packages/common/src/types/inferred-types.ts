import { z } from "zod";
import { uploadRequestSchema } from "./types";

export type UploadRequest = z.infer<typeof uploadRequestSchema>;
