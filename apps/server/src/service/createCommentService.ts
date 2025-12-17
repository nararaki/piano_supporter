import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { CommentRepository } from "../repository/comment/repository.ts";
import type { createCommentData } from "@piano_supporter/common/commonResponseType/honoRequest.ts";
import { createCommentEntity } from "@piano_supporter/common/domains/comment.ts";
import type { Comment } from "@piano_supporter/common/domains/comment.ts";

export class CreateCommentService {
	constructor(private commentRepository: CommentRepository) {}

	async exec(data: createCommentData): Promise<Result<Comment>> {
        const comment = createCommentEntity(data);
		const result = await this.commentRepository.create(comment);
		return result;
	}
}
