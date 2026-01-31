import { zValidator } from "@hono/zod-validator";
import type { schoolCreateData } from "@piano_supporter/common/commonResponseType/honoRequest.ts";
import {
	AccountCreateSchema,
	CreateCommentSchema,
	CreatePostSchema,
	CreatePracticeSchema,
	CreateTaskSchema,
	EnrollSchoolCreateSchema,
	GeneratePresignedUrlSchema,
	GetMusicsSchema,
	GetPostSchema,
	GetPostsSchema,
	GetPracticeByIdSchema,
	GetPracticeSchema,
	GetSchoolSchema,
	SchoolCreateSchema,
} from "@piano_supporter/common/commonResponseType/honoRequest.ts";
import { err, ok } from "@piano_supporter/common/lib/error.ts";
import { Hono } from "hono";
import { newS3PresignedUrlGenerator } from "src/infrastructure/s3/presignedUrlGenerator.ts";
import {
	accountResitoryClient,
	createCommentService,
	createPostService,
	createPracticeService,
	createTaskService,
	enrollAccountToSchoolService,
	getAllPostsService,
	getAllPracticeService,
	getComposersService,
	getMusicsService,
	getPostDetailService,
	getPracticeService,
	getSchoolService,
	getTasksService,
	initializeAccountService,
	initializeSchoolService,
	schoolRepositoryClient,
} from "../service/container/index.ts";

export const accountRoute = new Hono()
	.get("/:userId", async (c) => {
		const userId = c.req.param("userId");
		if (!userId) {
			return c.json(
				err({
					type: "BAD_REQUEST",
					message: "userIdが必要です",
				}),
				400,
			);
		}
		const result = await accountResitoryClient.findById(userId);
		if (!result.ok) {
			return c.json(result, 200);
		}
		return c.json(result, 200);
	})
	.post("/", zValidator("json", AccountCreateSchema), async (c) => {
		const body = await c.req.json();
		const { userId, lastName, firstName, email } = body;
		const result = await initializeAccountService.exec(
			userId,
			lastName,
			firstName,
			email,
		);
		if (!result.ok) {
			return c.json(result, 200);
		}
		return c.json(result, 200);
	});

export const schoolRoute = new Hono()
	.get("/", zValidator("query", GetSchoolSchema), async (c) => {
		const query = await c.req.query();
		const { accountId } = query;
		console.log("accountId", accountId);
		const result = await getSchoolService.exec(accountId);
		console.log("result", result);
		if (!result.ok) {
			return c.json(result, 200);
		}
		return c.json(result, 200);
	})
	.get("/:schoolId", async (c) => {
		const schoolId = c.req.param("schoolId");
		if (!schoolId) {
			return c.json(
				err({
					type: "BAD_REQUEST",
					message: "schoolIdが必要です",
				}),
				400,
			);
		}
		const result = await schoolRepositoryClient.findById(schoolId);
		if (!result.ok) {
			return c.json(result, 200);
		}
		return c.json(result, 200);
	})
	.post("/", zValidator("json", SchoolCreateSchema), async (c) => {
		const body = (await c.req.json()) as schoolCreateData;
		const result = await initializeSchoolService.exec(body);
		if (!result.ok) {
			return c.json(result, 200);
		}
		return c.json(result, 200);
	});

export const enrollSchoolRoute = new Hono()
	.get("/share-code/:shareCode", async (c) => {
		const shareCode = c.req.param("shareCode");
		if (!shareCode) {
			return c.json(
				err({
					type: "BAD_REQUEST",
					message: "shareCodeが必要です",
				}),
				400,
			);
		}
		const result = await schoolRepositoryClient.findByShareCode(shareCode);
		if (!result.ok) {
			return c.json(result, 200);
		}
		return c.json(result, 200);
	})
	.post("/", zValidator("json", EnrollSchoolCreateSchema), async (c) => {
		const body = await c.req.json();
		const result = await enrollAccountToSchoolService.exec(body);
		if (!result.ok) {
			return c.json(result, 200);
		}
		return c.json(result, 200);
	});

export const postsRoute = new Hono()
	.get("/detail/:postId", zValidator("param", GetPostSchema), async (c) => {
		const postId = c.req.param("postId");
		if (!postId) {
			return c.json(
				err({
					type: "BAD_REQUEST",
					message: "postIdが必要です",
				}),
				400,
			);
		}
		const result = await getPostDetailService.exec(postId);

		if (!result.ok) {
			return c.json(result, 200);
		}
		const commentsAsObject = Object.fromEntries(result.value.comments);

		// resultの中身を書き換えた新しいオブジェクトを作る（またはresultを直接書き換える）
		const responseData = {
			...result.value,
			comments: commentsAsObject,
		};

		return c.json(ok(responseData), 200);
	})
	.get("/:accountId", zValidator("param", GetPostsSchema), async (c) => {
		const accountId = c.req.param("accountId");
		if (!accountId) {
			return c.json(
				err({
					type: "BAD_REQUEST",
					message: "accountIdが必要です",
				}),
				400,
			);
		}
		const result = await getAllPostsService.exec(accountId);
		if (!result.ok) {
			console.log("result", result);
			return c.json(result, 200);
		}
		console.log("result", result);
		return c.json(result, 200);
	})
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
				return c.json(result, 200);
			}
			return c.json(result, 200);
		},
	)
	.post("/", zValidator("json", CreatePostSchema), async (c) => {
		const body = await c.req.json();
		const result = await createPostService.exec(body);
		if (!result.ok) {
			return c.json(result, 200);
		}
		return c.json(result, 200);
	});

export const practiceRoute = new Hono()
	.get(
		"/schoolAndAccount",
		zValidator("query", GetPracticeSchema),
		async (c) => {
			const query = await c.req.query();
			const { accountId, schoolId } = query;
			const result = await getAllPracticeService.exec(accountId, schoolId);
			if (!result.ok) {
				return c.json(result, 200);
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
	.post("/", zValidator("json", CreatePracticeSchema), async (c) => {
		const body = await c.req.json();
		const result = await createPracticeService.exec(body);
		if (!result.ok) {
			return c.json(result, 200);
		}
		return c.json(result, 200);
	});

export const composersRoute = new Hono().get("/", async (c) => {
	const result = await getComposersService.exec();
	if (!result.ok) {
		return c.json(result, 200);
	}
	return c.json(result, 200);
});

export const musicsRoute = new Hono().get(
	"/:composerName",
	zValidator("param", GetMusicsSchema),
	async (c) => {
		const composerName = c.req.param("composerName");
		if (!composerName) {
			return c.json(
				err({
					type: "BAD_REQUEST",
					message: "composerNameが必要です",
				}),
				400,
			);
		}
		const result = await getMusicsService.exec(composerName);
		if (!result.ok) {
			return c.json(result, 200);
		}
		return c.json(result, 200);
	},
);

export const commentsRoute = new Hono().post(
	"/",
	zValidator("json", CreateCommentSchema),
	async (c) => {
		const body = await c.req.json();
		const result = await createCommentService.exec(body);
		if (!result.ok) {
			return c.json(result, 200);
		}
		return c.json(result, 200);
	},
);

export const taskRoute = new Hono()
	.get(
		"/:practiceId",
		zValidator("param", GetPracticeByIdSchema),
		async (c) => {
			const practiceId = c.req.param("practiceId");
			if (!practiceId) {
				return c.json(
					err({
						type: "BAD_REQUEST",
						message: "practiceIdが必要です",
					}),
					400,
				);
			}
			const result = await getTasksService.exec(practiceId);
			if (!result.ok) {
				return c.json(result, 200);
			}
			return c.json(result, 200);
		},
	)
	.post("/", zValidator("json", CreateTaskSchema), async (c) => {
		const body = await c.req.json();
		const result = await createTaskService.exec(body);
		if (!result.ok) {
			return c.json(result, 200);
		}
		return c.json(result, 200);
	});
