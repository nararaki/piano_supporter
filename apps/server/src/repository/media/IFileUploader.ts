import type { Result } from "@piano_supporter/common/lib/error.ts";
export interface IFileUploader {
	uploadVideo(file: Buffer): Promise<Result<string>>;
}
