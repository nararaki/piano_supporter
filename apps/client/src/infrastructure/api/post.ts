import { client } from "@/lib/apiClient";
import { callApi } from "@/lib/apiResponse";
import type { Post } from "@piano_supporter/common/domains/post.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

/**
 * アカウントIDに基づいて投稿一覧を取得
 */
export const getPostsByAccountId = async (
	accountId: string,
): Promise<Result<Post[]>> => {
	const result = await callApi<Result<Post[]>>(() =>
		client["posts"].$get({
			query: { accountId },
		})
	);

	if (!result.ok) {
		return result;
	}

	return result.value;
};

