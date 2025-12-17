import { createCommentApi } from "@/infrastructure/api/comment";
export const createComment = async (
    postId: string, 
    accountId: string, 
    content: string,
    parentCommentId?: string | null
) => {
    const result = await createCommentApi(postId, accountId, content, parentCommentId);
    return result;
}