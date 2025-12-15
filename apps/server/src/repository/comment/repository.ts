import { Result } from "@piano_supporter/common/lib/error.js";
import type { Comment } from "@piano_supporter/common/domains/comment.ts";

export interface CommentRepository {
	create(comment: Comment): Promise<Result<Comment>>;
}