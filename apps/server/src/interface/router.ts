import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
	enrollAccountToSchoolService,
	initializeAccountService,
	initializeSchoolService,
	schoolRepositoryClient,
	accountResitoryClient,
	getPostsService,
	createPostService,
} from "../service/container/index.ts";
import { AccountCreateSchema, SchoolCreateSchema, EnrollSchoolCreateSchema, GetPostsSchema, CreatePostSchema } from "./sheme.ts";
import { err } from "@piano_supporter/common/lib/error.ts";
import type { schoolCreateData } from "@piano_supporter/common/commonResponseType/honoResponse.ts";

export const accountRoute = new Hono()
	.get("/:userId", async (c) => {
		const userId = c.req.param("userId");
		if (!userId) {
			return c.json({ ok: false, error: { type: "INVALID_INPUT", message: "userIdが必要です" } }, 400);
		}
		const result = await accountResitoryClient.findById(userId);
		if (!result.ok) {
			return c.json(result, 404);
		}
		return c.json(result, 200);
	})
	.post(
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

export const schoolRoute = new Hono()
	.get("/:schoolId", async (c) => {
		const schoolId = c.req.param("schoolId");
		if (!schoolId) {
			return c.json(err({
				type: "BAD_REQUEST",
				message: "schoolIdが必要です",
			}), 400);
		}
		const result = await schoolRepositoryClient.findById(schoolId);
		if (!result.ok) {
			return c.json(result, 404);
		}
		return c.json(result, 200);
	})
	.post(
		"/",
		zValidator("json", SchoolCreateSchema),
		async (c) => {
			const body = await c.req.json() as schoolCreateData;
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
			return c.json(err({
				type: "BAD_REQUEST",
				message: "shareCodeが必要です",
			}), 400);
		}
		const result = await schoolRepositoryClient.findByShareCode(shareCode);
		if (!result.ok) {
			return c.json(result, 404);
		}
		return c.json(result, 200);
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

export const postsRoute = new Hono()
	.post(
		"/",
		zValidator("json", GetPostsSchema),
		async (c) => {
			const body = await c.req.json();
			const { accountId } = body;
			const result = await getPostsService.exec(accountId);
			if (!result.ok) {
				return c.json(result, 404);
			}
			return c.json(result, 200);
		},
	)
	.post(
		"/create",
		zValidator("json", CreatePostSchema),
		async (c) => {
			const body = await c.req.json();
			const result = await createPostService.exec(body);
			if (!result.ok) {
				return c.json(result, 500);
			}
			return c.json(result, 200);
		},
	);