import { client } from "@/lib/apiClient";
import type { mockPot } from "@piano_supporter/common/domains/post.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export interface CreatePostData {
	accountId: string;
	title: string;
	content: string;
}

export const createPost = async (
	data: CreatePostData,
): Promise<Result<mockPot>> => {
	try {
		const rawResult = await client['posts']['create'].$post({
			json: data
		});
		const response = await rawResult.json() as Result<mockPot>;
		
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
				message: error instanceof Error ? error.message : "投稿の作成に失敗しました",
			},
		};
	}
};

