import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import { db } from "../initial.ts";
import { post } from "../schema/post.ts";
import { eq } from "drizzle-orm";
import { uuidv7 } from "uuidv7";
import type { PostsRepository, CreatePostData } from "../../../repository/posts/repository.ts";
import type { Post } from "@piano_supporter/common/domains/post.ts";
import { newVideoRepositoryClient } from "./video.ts";

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

	async create(data: CreatePostData): Promise<Result<Post>> {
		try {
			const postId = uuidv7();
			const now = new Date();
			await db.insert(post).values({
				id: postId,
				accountId: data.accountId,
				schoolId: data.schoolId,
				title: data.title,
				content: data.content,
			});
			//videoが存在する場合はvideoエンティティを作成
			if (data.videoUrl) {
				const videoCreateResult = await newVideoRepositoryClient.create({
					postId: postId,
					url: data.videoUrl,
					// typeは必要に応じて追加可能
				});
				if (!videoCreateResult.ok) {
					return err({
						type: "UNEXPECTED",
						message: "videoの作成に失敗しました",
					});
				}
				return ok({
					id: postId,
					accountId: data.accountId,
					title: data.title,
					content: data.content,
					video: videoCreateResult.value,
					createdAt: now,
					updatedAt: null,
				})
			}

			return ok({
				id: postId,
				...data,
				video: null,
				createdAt: now,
				updatedAt: null,
			});
		} catch (e) {
			console.log("投稿の作成に失敗しました", e);
			return err({
				type: "UNEXPECTED",
				message: "投稿の作成に失敗しました",
			});
		}
	}

	async findBySchoolId(schoolId: string): Promise<Result<Post[]>> {
		try {
			const data = await db
				.select({
					id: post.id,
					accountId: post.accountId,
					title: post.title,
					content: post.content,
					createdAt: post.createdAt,
					updatedAt: post.updatedAt,
				})
				.from(post)
				.where(eq(post.schoolId, schoolId))
				.execute();
			
			// 各投稿に対してvideoとaccountを取得
			//いずれはバッチ処理にしたいよね多分joinとかでできるから
			const posts: Post[] = await Promise.all(
				data.map(async (row) => {
					const videoResult = await newVideoRepositoryClient.findByPostId(row.id);
					const video = videoResult.ok ? videoResult.value : null;

					return {
						id: row.id,
						accountId: row.accountId,
						title: row.title || "",
						content: row.content || "",
						video: video,
						createdAt: row.createdAt,
						updatedAt: row.updatedAt || null,
					};
				})
			);
			
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

