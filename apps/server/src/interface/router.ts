import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
	enrollAccountToSchoolService,
	initializeAccountService,
	initializeSchoolService,
	schoolRepositoryClient,
} from "../service/container/index.ts";
import { AccountCreateSchema, EnrollSchoolCreateSchema, SchoolCreateSchema } from "./schema.ts";
import { ok } from "@piano_supporter/common/lib/error.ts";

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
			return c.json(result, 500);
		}
		return c.json(result, 200);
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

export const enrollSchoolRoute = new Hono()
	.get("/share-code/:shareCode", async (c) => {
		const shareCode = c.req.param("shareCode");
		if (!shareCode) {
			return c.json({ message: "shareCodeが必要です" }, 400);
		}
		const result = await schoolRepositoryClient.findByShareCode(shareCode);
		if (!result.ok) {
			return c.json({ message: result.error.message }, 404);
		}
		return c.json(result.value, 200);
	})
	.post(
		"/",
		zValidator("json", EnrollSchoolCreateSchema),
		async (c) => {
			const body = await c.req.json();
			const result = await enrollAccountToSchoolService.exec(body);
		if (!result.ok) {
			return c.json(result, 500);
		}
		return c.json(result, 200);
		},
	);