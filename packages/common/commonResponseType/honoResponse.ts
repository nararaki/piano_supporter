import type { Post } from "../domains/post";
import type { CommentNode } from "../domains/comment";

export type getPostDetailResponse = {
	post: Post;
	comments: Map<string, CommentNode>;
}