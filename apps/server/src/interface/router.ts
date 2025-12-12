import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
	enrollAccountToSchoolService,
	initializeAccountService,
	initializeSchoolService,
	schoolRepositoryClient,
	accountResitoryClient,
	getAllPostsService,
	createPostService,
	getPracticeService,
	getSchoolService,
	createPracticeService,
	getComposersService,
	getMusicsService,
	getAllPracticeService,
} from "../service/container/index.ts";
import { 
	AccountCreateSchema, 
	SchoolCreateSchema, 
	EnrollSchoolCreateSchema, 
	GetPostsSchema, 
	CreatePostSchema, 
	GeneratePresignedUrlSchema, 
	GetPracticeSchema, 
	GetSchoolSchema,
	CreatePracticeSchema,
	GetMusicsSchema,
	GetPracticeByIdSchema,
} from "./scheme.ts";
import { err } from "@piano_supporter/common/lib/error.ts";
import type { schoolCreateData } from "@piano_supporter/common/commonResponseType/honoResponse.ts";
import { newS3PresignedUrlGenerator } from "src/infrastructure/s3/presignedUrlGenerator.ts";

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
	.get("/", 
		zValidator("query", GetSchoolSchema),
		async (c) => {
		const query = await c.req.query();
		const { accountId } = query;
		console.log("accountId", accountId);
		const result = await getSchoolService.exec(accountId);
		console.log("result", result);
		if (!result.ok) {
			return c.json(result, 404);
		}
		return c.json(result, 200);
	})
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
	.get(
		"/",
		zValidator("query", GetPostsSchema),
		async (c) => {
			console.log("c.req.query()", c.req.query());
			const query = await c.req.query();
			const { accountId } = query;
			const result = await getAllPostsService.exec(accountId);
			if (!result.ok) {
				console.log("result", result);
				return c.json(result, 404);
			}
			console.log("result", result);
			return c.json(result, 200);
		},
	)
	.post(
		"/presigned-url",
		zValidator("json", GeneratePresignedUrlSchema),
		async (c) => {
			const body = await c.req.json();
			const { fileName, contentType } = body;
			const result = await newS3PresignedUrlGenerator.generatePresignedUrl(
				fileName,
				contentType,
			);
			if (!result.ok) {
				return c.json(result, 500);
			}
			return c.json(result, 200);
		},
	)
	.post(
		"/",
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

export const practiceRoute = new Hono()
	.get(
		"/schoolAndAccount",
		zValidator("query", GetPracticeSchema),
		async (c) => {
			const query = await c.req.query();
			const { accountId, schoolId } = query;
			const result = await getAllPracticeService.exec(accountId, schoolId);
			if (!result.ok) {
				return c.json(result, 404);
			}
			return c.json(result, 200);
		},
	)
	.get(
		"/:practiceId",
		zValidator("param", GetPracticeByIdSchema),
		async (c) => {
			const practiceId = c.req.param("practiceId");
			const result = await getPracticeService.exec(practiceId);
			return c.json(result, 200);
		},
	)
	.post(
		"/",
		zValidator("json", CreatePracticeSchema),
		async (c) => {
			const body = await c.req.json();
			const result = await createPracticeService.exec(body);
			if (!result.ok) {
				return c.json(result, 500);
			}
			return c.json(result, 200);
		},
	);

export const composersRoute = new Hono()
	.get(
		"/",
		async (c) => {
			const result = await getComposersService.exec();
			if (!result.ok) {
				return c.json(result, 404);
			}
			return c.json(result, 200);
		},
	);

export const musicsRoute = new Hono()
	.get(
		"/",
		zValidator("query", GetMusicsSchema),
		async (c) => {
			const query = await c.req.query();
			const { composerId } = query;
			const result = await getMusicsService.exec(composerId);
			if (!result.ok) {
				return c.json(result, 404);
			}
			return c.json(result, 200);
		},
	);