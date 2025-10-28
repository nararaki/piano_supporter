import { newCloudinaryApiClient } from "../../infrastructure/cloudinary/uploadMedia.ts";
import { UploadVideoService } from "../uploadVideoService.ts";
export const cloudinaryApiClient = newCloudinaryApiClient;

export const uploadVideoService = new UploadVideoService(
    cloudinaryApiClient
);