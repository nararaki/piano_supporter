import { z } from "zod";

//クライアントが送るデータの定義
export const SchoolCreateSchema = z.object({
	name: z.string().min(1, { message: "学校名は必須です" }),
	location: z.string().min(1, { message: "所在地は必須です" }),
	email: z.string().min(1, { message: "無効なメール形式です" }),
});

export const AccountCreateSchema = z.object({
	userId: z.string().min(1, { message: "userIdがないです" }),
	lastName: z.string().min(1, { message: "名字がないです" }),
	firstName: z.string().min(1, { message: "名前が無いです" }),
	email: z.string().min(1, { message: "無効なメール形式です" }),
});

export type accountCreateData = z.infer<typeof AccountCreateSchema>;
export type schoolCreateData = z.infer<typeof SchoolCreateSchema>;
