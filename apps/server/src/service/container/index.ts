import { newCloudinaryApiClient } from "../../infrastructure/cloudinary/uploadMedia.ts";
import { UploadVideoService } from "../uploadVideoService.ts";
import { InitializeAccountService } from "../initializeAccountService.ts";
import { newAccountRespositoryClient } from "../../infrastructure/db/repositories/account.ts";
import { newSchoolRepositoryClient } from "@root/src/infrastructure/db/repositories/school.ts";
import { InitializeSchoolService } from "../initializeSchoolService.ts";

export const cloudinaryApiClient = newCloudinaryApiClient;
export const accountResitoryClient = newAccountRespositoryClient;
export const schoolRepositoryClient = newSchoolRepositoryClient

export const uploadVideoService = new UploadVideoService(
    cloudinaryApiClient
);

export const initializeAccountService = new InitializeAccountService(
    newAccountRespositoryClient
);

export const initializeSchoolService = new InitializeSchoolService(
    schoolRepositoryClient
);