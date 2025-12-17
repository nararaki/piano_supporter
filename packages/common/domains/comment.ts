import type { createCommentData } from "../commonResponseType/honoRequest.ts";
import { uuidv7 } from "uuidv7";

export interface Comment {
	id: string;
	postId: string;
	accountId: string;
	content: string;
    parentCommentId: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export function createCommentEntity(data: createCommentData): Comment {
	return {
		id: uuidv7(),
		postId: data.postId,
		accountId: data.accountId,
		content: data.content,
		parentCommentId: data.parentCommentId ? data.parentCommentId : null,
		createdAt: new Date(),
		updatedAt: new Date(),
	};
}

export interface CommentNode {
	comment: Comment;
	children: CommentNode[];
}