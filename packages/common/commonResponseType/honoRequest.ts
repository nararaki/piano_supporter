import type { AppType } from "../../../apps/server/src/interface/index.js";
import { z } from "zod";
//クライアントが送るデータの定義
export const SchoolCreateSchema = z.object({
	name: z.string().min(1, { message: "学校名は必須です" }),
	location: z.string().min(1, { message: "所在地は必須です" }),
	email: z.string().min(1, { message: "無効なメール形式です" }),
	userId: z.string().min(1, { message: "userIdがないです" }),
});

export const GetSchoolSchema = z.object({
	accountId: z.string().min(1, { message: "accountIdがないです" }),
});

export const AccountCreateSchema = z.object({
	userId: z.string().min(1, { message: "userIdがないです" }),
	lastName: z.string().min(1, { message: "名字がないです" }),
	firstName: z.string().min(1, { message: "名前が無いです" }),
	email: z.string().min(1, { message: "無効なメール形式です" }),
});

export const EnrollSchoolCreateSchema = z.object({
	accountId: z.string().min(1, { message: "accountIdがないです" }),
	schoolId: z.string().min(1, { message: "schoolIdがないです" }),
});

export const GetPostsSchema = z.object({
	accountId: z.string().min(1, { message: "accountIdがないです" }),
});

export const GetPracticeSchema = z.object({
	accountId: z.string().min(1, { message: "accountIdがないです" }),
	schoolId: z.string().min(1, { message: "schoolIdがないです" }),
});

export const CreatePostSchema = z.object({
	accountId: z.string().min(1, { message: "accountIdがないです" }),
	title: z.string().min(1, { message: "タイトルは必須です" }),
	content: z.string().min(1, { message: "内容は必須です" }),
	videoUrl: z.string().min(1, { message: "動画URLは必須です" }),
	videoType: z.string().min(1, { message: "動画タイプは必須です" }),
});

export const GeneratePresignedUrlSchema = z.object({
	fileName: z.string().min(1, { message: "ファイル名は必須です" }),
	contentType: z.string().min(1, { message: "Content-Typeは必須です" }),
});

export const UploadVideoSchema = z.object({
	fileName: z.string().min(1, { message: "ファイル名は必須です" }),
	contentType: z.string().min(1, { message: "Content-Typeは必須です" }),
});

export const CreatePracticeSchema = z.object({
	accountId: z.string().min(1, { message: "accountIdがないです" }),
	schoolId: z.string().min(1, { message: "schoolIdがないです" }),
	musicTitle: z.string().min(1, { message: "musicTitleがないです" }),
});

export const GetMusicsSchema = z.object({
	composerName: z.string().min(1, { message: "composerNameがないです" }),
});

export const GetPracticeByIdSchema = z.object({
	practiceId: z.string().min(1, { message: "practiceIdがないです" }),
});

export const CreateCommentSchema = z.object({
	postId: z.string().min(1, { message: "postIdがないです" }),
	accountId: z.string().min(1, { message: "accountIdがないです" }),
	content: z.string().min(1, { message: "内容は必須です" }),
	parentCommentId: z.string().min(1, { message: "parentCommentIdがないです" }).optional(),
});

export const GetPostSchema = z.object({
	postId: z.string().min(1, { message: "postIdがないです" }),
});

export const CreateTaskSchema = z.object({
    title: z.string().min(1,{message: "titleがないです"}),
    content: z.string().min(1,{message: "コメントする内容を書いてください"}),
    practiceId: z.string().min(1,{message:"practiceIdがないです"}),
	sectionNumber: z.number().min(1,{message:"小節番号がないです"}),
	timePosition: z.number().min(0,{message:"時間位置がないです"}),
})

export type accountCreateData = z.infer<typeof AccountCreateSchema>;
export type schoolCreateData = z.infer<typeof SchoolCreateSchema>;
export type shareCodeCreateData = z.infer<typeof EnrollSchoolCreateSchema>;
export type generatePresignedUrlData = z.infer<typeof GeneratePresignedUrlSchema>;
export type uploadVideoData = z.infer<typeof UploadVideoSchema>;
export type createPostData = z.infer<typeof CreatePostSchema>;
export type getPostsData = z.infer<typeof GetPostsSchema>;
export type createPracticeData = z.infer<typeof CreatePracticeSchema>;
export type createCommentData = z.infer<typeof CreateCommentSchema>;
export type createTaskData = z.infer<typeof CreateTaskSchema>;

export type appType = AppType;