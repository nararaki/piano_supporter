import type { Comment } from "@piano_supporter/common/domains/comment.ts";
import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import { db } from "../initial.ts";
import { comment } from "../schema/comment.ts";
import type { CommentRepository } from "../../../repository/comment/repository.ts";

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
}

export const newCommentRepositoryClient = new CommentRepositoryClient();