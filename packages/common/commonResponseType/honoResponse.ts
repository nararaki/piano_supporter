import type { z } from "zod";
//インポートきれいにしたいけど分からん
import type { 
    AccountCreateSchema, 
    SchoolCreateSchema, 
    EnrollSchoolCreateSchema, 
    GeneratePresignedUrlSchema, 
    UploadVideoSchema, 
    CreatePostSchema, 
    GetPostsSchema, 
    CreatePracticeSchema,
    CreateCommentSchema,
} from "../../../apps/server/src/interface/scheme.ts";
import type { AppType } from "../../../apps/server/src/interface/index.ts";

export type accountCreateData = z.infer<typeof AccountCreateSchema>;
export type schoolCreateData = z.infer<typeof SchoolCreateSchema>;
export type shareCodeCreateData = z.infer<typeof EnrollSchoolCreateSchema>;
export type generatePresignedUrlData = z.infer<typeof GeneratePresignedUrlSchema>;
export type uploadVideoData = z.infer<typeof UploadVideoSchema>;
export type createPostData = z.infer<typeof CreatePostSchema>;
export type getPostsData = z.infer<typeof GetPostsSchema>;
export type createPracticeData = z.infer<typeof CreatePracticeSchema>;
export type createCommentData = z.infer<typeof CreateCommentSchema>;


export type appType = AppType;