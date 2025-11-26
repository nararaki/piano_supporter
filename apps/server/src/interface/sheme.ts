import { z } from "zod";
//クライアントが送るデータの定義
export const SchoolCreateSchema = z.object({
	name: z.string().min(1, { message: "学校名は必須です" }),
	location: z.string().min(1, { message: "所在地は必須です" }),
	email: z.string().min(1, { message: "無効なメール形式です" }),
	userId: z.string().min(1, { message: "userIdがないです" }),
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

export const CreatePostSchema = z.object({
	accountId: z.string().min(1, { message: "accountIdがないです" }),
	title: z.string().min(1, { message: "タイトルは必須です" }),
	content: z.string().min(1, { message: "内容は必須です" }),
});