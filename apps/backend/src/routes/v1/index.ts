import express from "express";
import { generatePresignedUrl } from "../../controller/s3-controller";

const router = express.Router();

router.post("/generate-presigned-url", generatePresignedUrl);

export default router;
