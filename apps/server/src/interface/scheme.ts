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
	musicId: z.string().min(1, { message: "musicIdがないです" }),
});

export const GetMusicsSchema = z.object({
	composerId: z.string().min(1, { message: "composerIdがないです" }),
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