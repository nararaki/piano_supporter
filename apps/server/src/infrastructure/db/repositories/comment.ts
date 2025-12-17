import type { Comment } from "@piano_supporter/common/domains/comment.ts";
import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import { db } from "../initial.ts";
import { comment } from "../schema/comment.ts";
import type { CommentRepository } from "../../../repository/comment/repository.ts";
import { eq } from "drizzle-orm";

export class CommentRepositoryClient implements CommentRepository {
	async create(data: Comment): Promise<Result<Comment>> {
		const result = await db
        .insert(comment)
        .values(data)
        .$returningId()
        .execute();
		if (!result) {
			return err({
				type: "CANNOT_CREATE_COMMENT",
				message: "コメントの作成に失敗しました",
			});
		}
		return ok(data);
	}

	async findByPostId(postId: string): Promise<Result<Comment[]>> {
		const result = await db
		.select()
		.from(comment)
		.where(eq(comment.postId, postId))
		.execute();
		if (!result) {
			return err({
				type: "CANNOT_FIND_COMMENT",
				message: "コメントが見つかりません",
			});
		}
		return ok(result);
	}
}

export const newCommentRepositoryClient = new CommentRepositoryClient();