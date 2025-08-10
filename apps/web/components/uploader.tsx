"use client";

import { FileRejection, useDropzone } from "react-dropzone";
import { useCallback, useState, useEffect } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Loader2, Trash2, Upload, CheckCircle2, AlertCircle, FileImage, Zap } from "lucide-react";
import { Card, CardContent } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Progress } from "@repo/ui/components/progress";
import { cn } from "@repo/ui/lib/utils";
import React from "react";
import Image from "next/image";

interface UploadFile {
	id: string;
	file: File;
	uploading: boolean;
	progress: number;
	key?: string;
	isDeleting: boolean;
	error: boolean;
	objectUrl?: string;
}

export function Uploader() {
	const [files, setFiles] = useState<UploadFile[]>([]);

	async function removeFile(fileId: string) {
		try {
			const fileToRemove = files.find((f) => f.id === fileId);
			if (fileToRemove?.objectUrl) {
				URL.revokeObjectURL(fileToRemove.objectUrl);
			}

			setFiles((prevFiles) => prevFiles.map((f) => (f.id === fileId ? { ...f, isDeleting: true } : f)));

			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/delete-file`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ key: fileToRemove?.key }),
			});

			if (!response.ok) {
				toast.error("Failed to remove file from storage.");
				setFiles((prevFiles) => prevFiles.map((f) => (f.id === fileId ? { ...f, isDeleting: false, error: true } : f)));
				return;
			}

			setFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileId));
			toast.success("File removed successfully");
		} catch (error) {
			console.error("ERROR", error);
			toast.error("Failed to remove file from storage.");
			setFiles((prevFiles) => prevFiles.map((f) => (f.id === fileId ? { ...f, isDeleting: false, error: true } : f)));
		}
	}

	const uploadFile = async (file: File) => {
		setFiles((prevFiles) => prevFiles.map((f) => (f.file === file ? { ...f, uploading: true } : f)));

		try {
			// 1. Get presigned URL
			const presignedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/generate-presigned-url`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					filename: file.name,
					contentType: file.type,
					size: file.size,
				}),
			});

			if (!presignedResponse.ok) {
				toast.error("Failed to get presigned URL");
				setFiles((prevFiles) =>
					prevFiles.map((f) => (f.file === file ? { ...f, uploading: false, progress: 0, error: true } : f))
				);
				return;
			}

			const { data } = await presignedResponse.json();
			const { presignedUrl, uniqueKey } = data;

			// 2. Upload file to S3
			await new Promise<void>((resolve, reject) => {
				const xhr = new XMLHttpRequest();

				xhr.upload.onprogress = (event) => {
					if (event.lengthComputable) {
						const percentComplete = (event.loaded / event.total) * 100;
						setFiles((prevFiles) =>
							prevFiles.map((f) =>
								f.file === file ? { ...f, progress: Math.round(percentComplete), key: uniqueKey } : f
							)
						);
					}
				};

				xhr.onload = () => {
					if (xhr.status === 200 || xhr.status === 204) {
						// 3. File fully uploaded - set progress to 100
						setFiles((prevFiles) =>
							prevFiles.map((f) => (f.file === file ? { ...f, progress: 100, uploading: false, error: false } : f))
						);
						toast.success("File uploaded successfully");
						resolve();
					} else {
						reject(new Error(`Upload failed with status: ${xhr.status}`));
					}
				};

				xhr.onerror = () => {
					reject(new Error("Upload failed"));
				};

				xhr.open("PUT", presignedUrl);
				xhr.setRequestHeader("Content-Type", file.type);
				xhr.send(file);
			});
		} catch (error) {
			console.error("ERROR", error);
			toast.error("Upload failed", {
				description: "There was an error uploading your file. Please try again.",
			});
			setFiles((prevFiles) =>
				prevFiles.map((f) => (f.file === file ? { ...f, uploading: false, progress: 0, error: true } : f))
			);
		}
	};

	const onDrop = useCallback((acceptedFiles: File[]) => {
		if (acceptedFiles.length) {
			setFiles((prevFiles) => [
				...prevFiles,
				...acceptedFiles.map((file) => ({
					id: uuidv4(),
					file,
					uploading: false,
					progress: 0,
					isDeleting: false,
					error: false,
					objectUrl: URL.createObjectURL(file),
				})),
			]);

			acceptedFiles.forEach(uploadFile);
		}
	}, []);

	const rejectedFiles = useCallback((fileRejection: FileRejection[]) => {
		if (fileRejection.length) {
			const tooManyFiles = fileRejection.find((rejection) => rejection.errors?.[0]?.code === "too-many-files");
			const fileSizeTooBig = fileRejection.find((rejection) => rejection.errors?.[0]?.code === "file-too-large");

			if (tooManyFiles) {
				toast.error("Too many files selected", {
					description: "Maximum 5 files allowed at once.",
				});
			}

			if (fileSizeTooBig) {
				toast.error("File too large", {
					description: "Maximum file size is 10MB.",
				});
			}
		}
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		onDropRejected: rejectedFiles,
		maxFiles: 5,
		maxSize: 1024 * 1024 * 10, // 10mb
		accept: {
			"image/*": [],
		},
	});

	useEffect(() => {
		return () => {
			// Cleanup object URLs when component unmounts
			files.forEach((file) => {
				if (file.objectUrl) {
					URL.revokeObjectURL(file.objectUrl);
				}
			});
		};
	}, [files]);

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	return (
		<div className="w-1/2 space-y-6">
			{/* Upload Area */}
			<Card
				{...getRootProps()}
				className={cn(
					"relative border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer group",
					"hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
					"min-h-[280px] flex items-center justify-center overflow-hidden",
					isDragActive
						? "border-primary bg-gradient-to-br from-primary/5 to-primary/10 border-solid shadow-lg scale-[1.02]"
						: "border-border hover:border-primary/60 hover:bg-gradient-to-br hover:from-primary/5 hover:to-transparent"
				)}
			>
				<CardContent className="flex flex-col items-center justify-center w-full h-full p-8 text-center">
					<input {...getInputProps()} />

					{/* Upload Icon */}
					<div
						className={cn(
							"relative mb-6 transition-all duration-300",
							isDragActive ? "scale-110" : "group-hover:scale-105"
						)}
					>
						<div
							className={cn(
								"w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300",
								isDragActive
									? "bg-primary text-primary-foreground shadow-lg"
									: "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground"
							)}
						>
							{isDragActive ? <Zap className="w-10 h-10 animate-pulse" /> : <Upload className="w-10 h-10" />}
						</div>

						{/* Animated rings */}
						{isDragActive && (
							<>
								<div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-primary/30 animate-ping" />
								<div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-primary/20 animate-pulse" />
							</>
						)}
					</div>

					{/* Text Content */}
					<div className="space-y-3 max-w-md">
						<h3
							className={cn(
								"text-xl font-semibold transition-colors duration-300",
								isDragActive ? "text-primary" : "text-foreground"
							)}
						>
							{isDragActive ? "Drop your images here" : "Upload Images"}
						</h3>

						<p className="text-muted-foreground text-sm leading-relaxed">
							{isDragActive
								? "Release to upload your images"
								: "Drag & drop your images here, or click to browse. Supports JPG, PNG, GIF up to 10MB."}
						</p>

						{!isDragActive && (
							<Button
								variant="outline"
								className="mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
							>
								<FileImage className="w-4 h-4 mr-2" />
								Choose Files
							</Button>
						)}
					</div>

					{/* File limits info */}
					<div className="absolute bottom-4 left-4 text-xs text-muted-foreground">Max 5 files • 10MB each</div>
				</CardContent>
			</Card>

			{/* File Grid */}
			{files.length > 0 && (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold">Uploaded Images ({files.length})</h3>
						{files.some((f) => f.uploading) && (
							<div className="flex items-center text-sm text-muted-foreground">
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Uploading...
							</div>
						)}
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						{files.map(({ id, file, uploading, progress, isDeleting, error, objectUrl }) => (
							<Card
								key={id}
								className={cn(
									"group relative p-0 overflow-hidden transition-all duration-300 hover:shadow-lg",
									error && "border-destructive/50 bg-destructive/5",
									uploading && "border-primary/50"
								)}
							>
								<CardContent className="p-0">
									{/* Image Preview */}
									<div className="relative aspect-square">
										<Image
											src={objectUrl ?? ""}
											alt={file.name}
											className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
											fill
										/>

										{/* Overlay States */}
										{uploading && !isDeleting && (
											<div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
												<Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
												<div className="text-white font-medium text-sm mb-2">{progress}%</div>
												<Progress value={progress} className="w-20 h-1 bg-white/20" />
											</div>
										)}

										{error && (
											<div className="absolute inset-0 bg-destructive/60 backdrop-blur-sm flex flex-col items-center justify-center">
												<AlertCircle className="w-8 h-8 text-white mb-2" />
												<div className="text-white font-medium text-sm">Upload Failed</div>
											</div>
										)}

										{/* Success State */}
										{!uploading && !error && !isDeleting && (
											<div className="absolute top-2 right-2">
												<div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
													<CheckCircle2 className="w-4 h-4 text-white" />
												</div>
											</div>
										)}

										{/* Delete Button */}
										<Button
											variant="destructive"
											size="icon"
											className={cn(
												"absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-300",
												"w-8 h-8 bg-black/50 hover:bg-black/70 border-0"
											)}
											onClick={(e) => {
												e.stopPropagation();
												removeFile(id);
											}}
											disabled={isDeleting || uploading}
										>
											{isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
										</Button>
									</div>

									{/* File Info */}
									<div className="p-3 space-y-1">
										<p className="text-sm font-medium truncate" title={file.name}>
											{file.name}
										</p>
										<div className="flex items-center justify-between text-xs text-muted-foreground">
											<span>{formatFileSize(file.size)}</span>
											<span className="uppercase">{file.type.split("/")[1]}</span>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
