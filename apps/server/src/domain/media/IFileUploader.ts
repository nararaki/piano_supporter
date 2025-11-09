import { Result } from "../../../../packages/lib/src/error.ts";

export interface IFileUploader {
    uploadVideo(file:Buffer):Promise<Result<string>>;
}