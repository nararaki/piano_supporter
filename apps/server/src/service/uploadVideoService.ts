import { err, ok } from "@piano_supporter/common/lib/error.ts";
import type { IFileUploader } from "../repository/media/IFileUploader.ts";
import { fileToBuffer } from "../lib/fileConverter.ts";

export class UploadVideoService {
	constructor(public fileuploader: IFileUploader) {}

	async exec(uploadedVideo: File) {
		const fileBuffer = await fileToBuffer(uploadedVideo);
		const uploadResult = await this.fileuploader.uploadVideo(fileBuffer);
		if (uploadResult.ok) {
			return ok(uploadResult.value);
		} else {
			return err({
				type: "FILE_UPLOAD_ERROR",
				message: "動画のアップロードに失敗しました",
			});
		}
	}
}
