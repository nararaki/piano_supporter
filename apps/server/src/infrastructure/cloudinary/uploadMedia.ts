import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import { v2 as cloudinary, type UploadApiOptions } from "cloudinary";
import streamifier from "streamifier";
import type { IFileUploader } from "../../domain/media/IFileUploader.ts";

export class CloudinaryApiClient implements IFileUploader {
	constructor() {
		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET,
		});
	}

	//事前にBufferへの変換等はservice層で行う
	async uploadVideo(file: Buffer): Promise<Result<string>> {
		return new Promise((resolve, reject) => {
			const options: UploadApiOptions = {
				resource_type: "video",
			};
			const uploadStream = cloudinary.uploader.upload_stream(
				options,
				(error, result) => {
					if (error) {
						reject(
							err({
								type: "FILE_UPLOAD_ERROR",
								message: "Failed to upload video to Cloudinary via stream",
							}),
						);
						return;
					}
					if (result && result.secure_url) {
						resolve(ok(result.secure_url));
					} else {
						reject(
							err({
								type: "FILE_UPLOAD_ERROR",
								message: "Cloudinary upload succeeded but URL was missing",
							}),
						);
					}
				},
			);
			streamifier.createReadStream(file).pipe(uploadStream);
		})
			.then((result) => result as Result<string>)
			.catch((error) => {
				return err({
					type: "FILE_UPLOAD_ERROR",
					message: "Unknown error during file upload" + error,
				});
			});
	}
}

export const newCloudinaryApiClient = new CloudinaryApiClient();
