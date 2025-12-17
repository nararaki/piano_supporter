import { getPostsByAccountId } from "@/infrastructure/api/post";
import type { Post } from "@piano_supporter/common/domains/post.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export const getPosts = async (
	accountId: string,
): Promise<Result<Post[]>> => {
	return await getPostsByAccountId(accountId);
};
