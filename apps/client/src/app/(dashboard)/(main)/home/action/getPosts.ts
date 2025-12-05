import { client } from "@/lib/apiClient";
import type { Post } from "@piano_supporter/common/domains/post.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export const getPosts = async (
	accountId: string,
): Promise<Result<Post[]>> => {
	try {
		const rawResult = await client['posts'].$get({
			json: { accountId: accountId }
		});
		const response = await rawResult.json() as Result<Post[]>;
		
		if (!response.ok) {
			return {
				ok: false,
				error: response.error,
			};
		}
		
		return response;
	} catch (error) {
		return {
			ok: false,
			error: {
				type: "UNEXPECTED",
				message: error instanceof Error ? error.message : "投稿の取得に失敗しました",
			},
		};
	}
};

