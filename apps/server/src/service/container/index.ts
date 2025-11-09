import { newCloudinaryApiClient } from "../../infrastructure/cloudinary/uploadMedia.ts";
import { UploadVideoService } from "../uploadVideoService.ts";
import { InitializeAccountService } from "../initializeAccountService.ts";
import { newAccountRespositoryClient } from "../../infrastructure/db/repositories/account.ts";

export const cloudinaryApiClient = newCloudinaryApiClient;
export const accountResitoryClient = newAccountRespositoryClient;

export const uploadVideoService = new UploadVideoService(
    cloudinaryApiClient
);

export const initializeAccountService = new InitializeAccountService(
    newAccountRespositoryClient
);
