import { Result } from "@piano_supporter/common/lib/error.ts";
import type { Comment } from "@piano_supporter/common/domains/comment.ts";

export interface CommentRepository {
	create(comment: Comment): Promise<Result<Comment>>;
	findByPostId(postId: string): Promise<Result<Comment[]>>;
}