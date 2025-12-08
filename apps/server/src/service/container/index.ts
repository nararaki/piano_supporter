import { newCloudinaryApiClient } from "../../infrastructure/cloudinary/uploadMedia.ts";
import { newAccountRespositoryClient } from "../../infrastructure/db/repositories/account.ts";
import { newSchoolRepositoryClient } from "../../infrastructure/db/repositories/school.ts";
import { newAccountSchoolRelationRepositoryClient } from "../../infrastructure/db/repositories/accountSchoolRelation.ts";
import { newAccountRoleRepositoryClient } from "../../infrastructure/db/repositories/accountRole.ts";
import { newPostsRepositoryClient } from "../../infrastructure/db/repositories/posts.ts";
import { newVideoRepositoryClient } from "../../infrastructure/db/repositories/video.ts";
import { InitializeAccountService } from "../initializeAccountService.ts";
import { InitializeSchoolService } from "../initializeSchoolService.ts";
import { UploadVideoService } from "../uploadVideoService.ts";
import { EnrollAccountToSchoolService } from "../enrollAccountToSchoolService.ts";
import { UserContextService } from "../userContextService.ts";
import { GetPostsService } from "../getPostsService.ts";
import { CreatePostService } from "../createPostService.ts";
import { GetPracticeService } from "../getPracticeService.ts";
import { CreatePracticeService } from "../createPracticeService.ts";
import { newRoleRepositoryClient } from "../../infrastructure/db/repositories/role.ts";
import { newPracticeRepositoryClient } from "../../infrastructure/db/repositories/practice.ts";
import { GetSchoolService } from "../getSchoolService.ts";

export const cloudinaryApiClient = newCloudinaryApiClient;
export const accountResitoryClient = newAccountRespositoryClient;
export const schoolRepositoryClient = newSchoolRepositoryClient;
export const accountSchoolRelationRepositoryClient = newAccountSchoolRelationRepositoryClient;
export const roleRepositoryClient = newRoleRepositoryClient;

export const uploadVideoService = new UploadVideoService(cloudinaryApiClient);

export const initializeAccountService = new InitializeAccountService(
	newAccountRespositoryClient,
);

export const initializeSchoolService = new InitializeSchoolService(
	schoolRepositoryClient,
	newAccountSchoolRelationRepositoryClient,
	newAccountRoleRepositoryClient,
	newRoleRepositoryClient,
);

export const userContextService = new UserContextService(
	newAccountRespositoryClient,
	schoolRepositoryClient,
);

export const enrollAccountToSchoolService = new EnrollAccountToSchoolService(
	userContextService,
	newRoleRepositoryClient,
	newAccountRoleRepositoryClient,
);

export const getPostsService = new GetPostsService(
	newAccountSchoolRelationRepositoryClient,
	newPostsRepositoryClient,
);

export const createPostService = new CreatePostService(
	newAccountSchoolRelationRepositoryClient,
	newPostsRepositoryClient,
	newVideoRepositoryClient,
);

export const getPracticeService = new GetPracticeService(
	newPracticeRepositoryClient,
	accountSchoolRelationRepositoryClient,
);

export const getSchoolService = new GetSchoolService(
	accountSchoolRelationRepositoryClient,
	newSchoolRepositoryClient,
);

export const createPracticeService = new CreatePracticeService(
	accountSchoolRelationRepositoryClient,
	newPracticeRepositoryClient,
);