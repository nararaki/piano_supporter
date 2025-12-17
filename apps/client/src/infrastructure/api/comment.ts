import { client } from "@/infrastructure/api/apiClient";
import { callApi } from "@/infrastructure/api/apiResponse";
import type { Comment } from "@piano_supporter/common/domains/comment.ts";

export const createCommentApi = async (
    postId: string, 
    accountId: string, 
    content: string,
    parentCommentId?: string | null
) => {
    const result = await callApi<Comment>(() =>
        client["comments"].$post({
            json: {
                postId,
                accountId,
                content,
                ...(parentCommentId && { parentCommentId }),
            },
        })
    );
    return result;
}