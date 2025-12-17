import { getPostDetail } from "@/infrastructure/api/post";

export async function getPost(postId: string) {
    const result = await getPostDetail(postId);
    return result;
}