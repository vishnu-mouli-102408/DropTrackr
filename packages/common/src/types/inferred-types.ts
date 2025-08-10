import { z } from "zod";
import { deleteFileRequestSchema, uploadRequestSchema } from "./types";

export type UploadRequest = z.infer<typeof uploadRequestSchema>;
export type DeleteFileRequest = z.infer<typeof deleteFileRequestSchema>;
