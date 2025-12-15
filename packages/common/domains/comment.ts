import type { createCommentData } from "../commonResponseType/honoResponse.ts";
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
		parentCommentId: null,
		createdAt: new Date(),
		updatedAt: new Date(),
	};
}