import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import { db } from "../initial.ts";
import { video } from "../schema/video.ts";
import { eq } from "drizzle-orm";
import { uuidv7 } from "uuidv7";
import type { VideoRepository } from "../../../repository/video/repository.ts";
import type { Video } from "@piano_supporter/common/domains/post.ts";

class VideoRepositoryClient implements VideoRepository {
	async findById(id: string): Promise<Result<Video>> {
		try {
			const [result] = await db
				.select()
				.from(video)
				.where(eq(video.id, id))
				.limit(1)
				.execute();

			if (result) {
				return ok({
					id: result.id,
					postId: result.postId,
					url: result.url,
					type: result.type || null,
					createdAt: result.createdAt,
					updatedAt: result.updatedAt || null,
				});
			}

			return err({
				type: "CANNOT_FIND_VIDEO",
				message: "動画が見つかりません",
			});
		} catch (e) {
			console.log("動画の取得に失敗しました", e);
			return err({
				type: "UNEXPECTED",
				message: "動画の取得に失敗しました",
			});
		}
	}

	async findByPostId(postId: string): Promise<Result<Video | null>> {
		try {
			const [result] = await db
				.select()
				.from(video)
				.where(eq(video.postId, postId))
				.limit(1)
				.execute();

			if (result) {
				return ok({
					id: result.id,
					postId: result.postId,
					url: result.url,
					type: result.type || null,
					createdAt: result.createdAt,
					updatedAt: result.updatedAt || null,
				});
			}

			return ok(null);
		} catch (e) {
			console.log("動画の取得に失敗しました", e);
			return err({
				type: "UNEXPECTED",
				message: "動画の取得に失敗しました",
			});
		}
	}

	async create(data: { postId: string; url: string; type?: string }): Promise<Result<Video>> {
		try {
			const videoId = uuidv7();
			const now = new Date();
			await db.insert(video).values({
				id: videoId,
				postId: data.postId,
				url: data.url,
				type: data.type || null,
			});

			return ok({
				id: videoId,
				postId: data.postId,
				url: data.url,
				type: data.type || null,
				createdAt: now,
				updatedAt: null,
			});
		} catch (e) {
			console.log("動画の作成に失敗しました", e);
			return err({
				type: "UNEXPECTED",
				message: "動画の作成に失敗しました",
			});
		}
	}
}

export const newVideoRepositoryClient = new VideoRepositoryClient();

