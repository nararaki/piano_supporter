import { newCloudinaryApiClient } from "../../infrastructure/cloudinary/uploadMedia.ts";
import { newAccountRespositoryClient } from "../../infrastructure/db/repositories/account.ts";
import { newSchoolRepositoryClient } from "../../infrastructure/db/repositories/school.ts";
import { InitializeAccountService } from "../initializeAccountService.ts";
import { InitializeSchoolService } from "../initializeSchoolService.ts";
import { UploadVideoService } from "../uploadVideoService.ts";
import { EnrollAccountToSchoolService } from "../enrollAccountToSchoolService.ts";
import { UserContextService } from "../userContextService.ts";

export const cloudinaryApiClient = newCloudinaryApiClient;
export const accountResitoryClient = newAccountRespositoryClient;
export const schoolRepositoryClient = newSchoolRepositoryClient;

export const uploadVideoService = new UploadVideoService(cloudinaryApiClient);

export const initializeAccountService = new InitializeAccountService(
	newAccountRespositoryClient,
);

export const initializeSchoolService = new InitializeSchoolService(
	schoolRepositoryClient,
);

export const userContextService = new UserContextService(
	newAccountRespositoryClient,
	schoolRepositoryClient,
);

export const enrollAccountToSchoolService = new EnrollAccountToSchoolService(
	userContextService,
);
