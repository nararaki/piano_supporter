import { Result } from "../../lib/error.ts";

export interface IFileUploader {
    uploadVideo(file:Buffer):Promise<Result<string>>;
}