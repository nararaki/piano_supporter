import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
	initializeAccountService,
	initializeSchoolService,
} from "../service/container/index.ts";
import { AccountCreateSchema, SchoolCreateSchema } from "./schema.ts";

export const accountRoute = new Hono().post(
	"/",
	zValidator("json", AccountCreateSchema),
	async (c) => {
		const body = await c.req.json();
		const { userId, lastName, firstName, email } = body;
		const result = await initializeAccountService.exec(
			userId,
			lastName,
			firstName,
			email,
		);
		if (!result.ok) {
			return c.json({ message: "アカウントの初期化に失敗しました" }, 500);
		}
		return c.json(result.value, 200);
	},
);

export const schoolRoute = new Hono().post(
	"/",
	zValidator("json", SchoolCreateSchema),
	async (c) => {
		const body = await c.req.json();
		const result = await initializeSchoolService.exec(body);
		if (!result.ok) {
			return c.json(result, 500);
		}
		return c.json(result, 200);
	},
);
