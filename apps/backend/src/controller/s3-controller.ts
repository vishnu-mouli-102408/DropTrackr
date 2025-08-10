import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import {
	BAD_REQUEST,
	BAD_REQUEST_MESSAGE,
	deleteFileRequestSchema,
	generateUUID,
	INTERNAL_SERVER_ERROR,
	INTERNAL_SERVER_ERROR_MESSAGE,
	logger,
	OK,
	OK_MESSAGE,
	uploadRequestSchema,
} from "@repo/common";
import type { Request, Response } from "express";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "../lib/s3-client";

export async function generatePresignedUrl(req: Request, res: Response) {
	try {
		const body = req.body;
		const parsedBody = uploadRequestSchema.safeParse(body);

		if (!parsedBody?.success) {
			return res.status(BAD_REQUEST).json({ message: BAD_REQUEST_MESSAGE, success: false, data: null });
		}

		const { filename, contentType, size } = parsedBody.data;
		const uniqueKey = `${generateUUID()}-${filename}`;

		const command = new PutObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: uniqueKey,
			ContentType: contentType,
			ContentLength: size,
		});

		const presignedUrl = await getSignedUrl(S3, command, {
			expiresIn: 360, // URL expires in 6 minutes
		});

		return res.status(OK).json({ data: { presignedUrl, uniqueKey }, message: OK_MESSAGE, success: true });
	} catch (error) {
		logger.error(error, "Error generating presigned url");
		res.status(INTERNAL_SERVER_ERROR).json({ message: INTERNAL_SERVER_ERROR_MESSAGE, success: false, data: null });
	}
}

export async function deleteFile(req: Request, res: Response) {
	try {
		const body = req.body;
		const parsedBody = deleteFileRequestSchema.safeParse(body);

		if (!parsedBody?.success) {
			return res.status(BAD_REQUEST).json({ message: BAD_REQUEST_MESSAGE, success: false, data: null });
		}

		const { key } = parsedBody.data;

		const command = new DeleteObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: key,
		});

		await S3.send(command);

		return res.status(OK).json({ message: OK_MESSAGE, success: true, data: null });
	} catch (error) {
		logger.error(error, "Error generating presigned url");
		res.status(INTERNAL_SERVER_ERROR).json({ message: INTERNAL_SERVER_ERROR_MESSAGE, success: false, data: null });
	}
}
