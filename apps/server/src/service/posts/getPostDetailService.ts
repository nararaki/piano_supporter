import { err, ok, type Result } from "@piano_supporter/common/lib/error.js";
import type { PostsRepository } from "../../repository/posts/repository.ts";
import type { CommentRepository } from "src/repository/comment/repository.ts";
import type { Comment, CommentNode } from "@piano_supporter/common/domains/comment.ts";
import type { getPostDetailResponse } from "@piano_supporter/common/commonResponseType/honoResponse.js";


export class GetPostDetailService {
	constructor(private postRepository: PostsRepository,
		private commentRepository: CommentRepository,
	) {}

	async exec(postId: string): Promise<Result<getPostDetailResponse>> {
		const post = await this.postRepository.findById(postId);
		if(!post.ok){
			return err({
				type: "CANNOT_FIND_POST",
				message: "投稿が見つかりません",
			});
		}
        const comments = await this.commentRepository.findByPostId(postId);
		if(!comments.ok){
			return err({
				type: "CANNOT_FIND_COMMENT",
				message: "コメントが見つかりません",
			});
		}
		console.log("comments", comments.value);
		const commentTree = this.commentTree(comments.value);
		console.log("commentTree", commentTree);
		return ok({
			post: post.value,
			comments: commentTree,
		})
	}

	private commentTree(comments: Comment[]): Map<string, CommentNode> {
		const commentMap = new Map<string, CommentNode>();
		comments.forEach(comment => {
			commentMap.set(comment.id, {
				comment: comment,
				children: [],
			});
		});
		comments.forEach(comment => {
			const commentNode = commentMap.get(comment.id);

			if(comment.parentCommentId && commentNode){
				commentMap.get(comment.parentCommentId)?.children.push(commentNode);
			}
		});
		return commentMap;
	}
}

