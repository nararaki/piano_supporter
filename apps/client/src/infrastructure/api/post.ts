import { client } from "@/lib/apiClient";
import { callApi } from "@/lib/apiResponse";
import type { getPostDetailResponse } from "@piano_supporter/common/commonResponseType/honoResponse.js";
import type { CommentNode } from "@piano_supporter/common/domains/comment.js";
import type { Post } from "@piano_supporter/common/domains/post.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";
import { ok } from "@piano_supporter/common/lib/error.ts";

/**
 * アカウントIDに基づいて投稿一覧を取得
 */
export const getPostsByAccountId = async (
	accountId: string,
): Promise<Result<Post[]>> => {
	const result = await callApi<Post[]>(() =>
		client["posts"][":accountId"].$get({
			param: {
				accountId,
			},
		})
	);
	return result;
};

export const getPostDetail = async (postId: string): Promise<Result<getPostDetailResponse>> => {
	const result = await callApi<{post:Post, comments:Record<string, CommentNode> | null}>(() =>
		client["posts"]["detail"][":postId"].$get({	
			param: {
				postId,
			},
		})
	);
	console.log("result", result);
	if (!result.ok) {
		console.log("result not ok", result.error);
		return result;
	}
	const comments = result.value.comments;
	console.log("comments", comments);
	console.log("result.value.post", result.value.post);
	if(!comments){
		return ok({
			post: result.value.post,
			comments: new Map<string,CommentNode>(),
		})
	}

	const commentsMap: Map<string, CommentNode> = new Map(Object.entries(comments));
	return ok({
		post: result.value.post,
		comments: commentsMap,
	})
};