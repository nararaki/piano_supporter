import { newCloudinaryApiClient } from "../../infrastructure/cloudinary/uploadMedia.ts";
import { newAccountRespositoryClient } from "../../infrastructure/db/repositories/account.ts";
import { newSchoolRepositoryClient } from "../../infrastructure/db/repositories/school.ts";
import { newAccountSchoolRelationRepository } from "../../infrastructure/db/repositories/accountSchoolRelation.ts";
import { newAccountRoleRepositoryClient } from "../../infrastructure/db/repositories/accountRole.ts";
import { InitializeAccountService } from "../initializeAccountService.ts";
import { InitializeSchoolService } from "../initializeSchoolService.ts";
import { UploadVideoService } from "../uploadVideoService.ts";
import { EnrollAccountToSchoolService } from "../enrollAccountToSchoolService.ts";
import { UserContextService } from "../userContextService.ts";
import { newRoleRepositoryClient } from "../../infrastructure/db/repositories/role.ts";

export const cloudinaryApiClient = newCloudinaryApiClient;
export const accountResitoryClient = newAccountRespositoryClient;
export const schoolRepositoryClient = newSchoolRepositoryClient;

export const uploadVideoService = new UploadVideoService(cloudinaryApiClient);

export const initializeAccountService = new InitializeAccountService(
	newAccountRespositoryClient,
);

export const initializeSchoolService = new InitializeSchoolService(
	schoolRepositoryClient,
	newAccountSchoolRelationRepository,
	newAccountRoleRepositoryClient,
	newRoleRepositoryClient,
);

export const userContextService = new UserContextService(
	newAccountRespositoryClient,
	schoolRepositoryClient,
);

export const enrollAccountToSchoolService = new EnrollAccountToSchoolService(
	userContextService,
);

export const roleRepositoryClient = newRoleRepositoryClient;
