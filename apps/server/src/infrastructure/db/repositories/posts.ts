import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import { db } from "../initial.ts";
import { post } from "../schema/post.ts";
import { eq } from "drizzle-orm";
import { uuidv7 } from "uuidv7";
import type { PostsRepository, CreatePostData } from "../../../repository/posts/repository.ts";
import type { mockPot } from "@piano_supporter/common/domains/post.ts";

class PostsRepositoryClient implements PostsRepository {
	async findById(id: number): Promise<any> {
		// 未実装
		return null;
	}

	async findByUserId(userId: string): Promise<any[]> {
		// 未実装
		return [];
	}

	async savePost(postData: any): Promise<void> {
		// 未実装
	}

	async create(data: CreatePostData): Promise<Result<mockPot>> {
		try {
			const postId = uuidv7();
			await db.insert(post).values({
				id: postId,
				accountId: data.accountId,
				schoolId: data.schoolId,
				title: data.title,
				content: data.content,
			});

			return ok({
				id: postId,
				accountId: data.accountId,
				title: data.title,
				content: data.content,
			});
		} catch (e) {
			console.log("投稿の作成に失敗しました", e);
			return err({
				type: "UNEXPECTED",
				message: "投稿の作成に失敗しました",
			});
		}
	}

	async findBySchoolId(schoolId: string): Promise<Result<mockPot[]>> {
		try {
			const data = await db
				.select({
					id: post.id,
					accountId: post.accountId,
					title: post.title,
					content: post.content,
				})
				.from(post)
				.where(eq(post.schoolId, schoolId))
				.execute();
			
			const posts: mockPot[] = data.map((row) => ({
				id: row.id,
				accountId: row.accountId,
				title: row.title || "",
				content: row.content || "",
			}));
			
			return ok(posts);
		} catch (e) {
			console.log("投稿の取得に失敗しました", e);
			return err({
				type: "UNEXPECTED",
				message: "投稿の取得に失敗しました",
			});
		}
	}
}

export const newPostsRepositoryClient = new PostsRepositoryClient();

