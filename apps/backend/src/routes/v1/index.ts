import express from "express";
import { deleteFile, generatePresignedUrl } from "../../controller/s3-controller";

const router = express.Router();

router.post("/generate-presigned-url", generatePresignedUrl);
router.delete("/delete-file", deleteFile);

export default router;
