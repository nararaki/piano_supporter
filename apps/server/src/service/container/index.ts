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
import { GetAllPostsService } from "../posts/getAllPostsService.ts";
import { CreatePostService } from "../posts/createPostService.ts";
import { GetAllPracticeService } from "../practice/getAllPracticeService.ts";
import { CreatePracticeService } from "../practice/createPracticeService.ts";
import { GetComposersService } from "../getComposersService.ts";
import { GetMusicsService } from "../getMusicsService.ts";
import { newRoleRepositoryClient } from "../../infrastructure/db/repositories/role.ts";
import { newPracticeRepositoryClient } from "../../infrastructure/db/repositories/practice.ts";
import { newComposerRepositoryClient } from "../../infrastructure/db/repositories/composer.ts";
import { newMusicRepositoryClient } from "../../infrastructure/db/repositories/music.ts";
import { GetSchoolService } from "../getSchoolService.ts";
import { GetPracticeService } from "../practice/getPracticeService.ts";
import { CreateCommentService } from "../createCommentService.ts";
import { newCommentRepositoryClient } from "../../infrastructure/db/repositories/comment.ts";

export const cloudinaryApiClient = newCloudinaryApiClient;
export const accountResitoryClient = newAccountRespositoryClient;
export const schoolRepositoryClient = newSchoolRepositoryClient;
export const accountSchoolRelationRepositoryClient = newAccountSchoolRelationRepositoryClient;
export const roleRepositoryClient = newRoleRepositoryClient;
export const commentRepositoryClient = newCommentRepositoryClient;
export const postRepositoryClient = newPostsRepositoryClient;
export const videoRepositoryClient = newVideoRepositoryClient;
export const practiceRepositoryClient = newPracticeRepositoryClient;
export const composerRepositoryClient = newComposerRepositoryClient;
export const musicRepositoryClient = newMusicRepositoryClient;
export const accountRoleRepositoryClient = newAccountRoleRepositoryClient;

export const uploadVideoService = new UploadVideoService(cloudinaryApiClient);

export const initializeAccountService = new InitializeAccountService(
	accountResitoryClient,
);

export const initializeSchoolService = new InitializeSchoolService(
	schoolRepositoryClient,
	accountSchoolRelationRepositoryClient,
	accountRoleRepositoryClient,
	roleRepositoryClient,
);

export const userContextService = new UserContextService(
	accountResitoryClient,
	schoolRepositoryClient,
);

export const enrollAccountToSchoolService = new EnrollAccountToSchoolService(
	userContextService,
	roleRepositoryClient,
	accountRoleRepositoryClient,
);

export const getAllPostsService = new GetAllPostsService(
	accountSchoolRelationRepositoryClient,
	postRepositoryClient,
);

export const createPostService = new CreatePostService(
	newAccountSchoolRelationRepositoryClient,
	postRepositoryClient,
	videoRepositoryClient,
);

export const getSchoolService = new GetSchoolService(
	accountSchoolRelationRepositoryClient,
	schoolRepositoryClient,
);

export const createPracticeService = new CreatePracticeService(
	accountSchoolRelationRepositoryClient,
	practiceRepositoryClient,
);

export const getComposersService = new GetComposersService(
	composerRepositoryClient,
);

export const getMusicsService = new GetMusicsService(
	musicRepositoryClient,
);

export const getAllPracticeService = new GetAllPracticeService(
	practiceRepositoryClient,
	accountSchoolRelationRepositoryClient,
);

export const getPracticeService = new GetPracticeService(
	practiceRepositoryClient,
);

export const createCommentService = new CreateCommentService(
	commentRepositoryClient,
);