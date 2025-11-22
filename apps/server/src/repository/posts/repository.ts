import type { Post } from "@piano_supporter/common/domains/post.ts";

export interface PostsRepository {
	findById(id: number): Promise<Post | null>;
	findByUserId(userId: string): Promise<Post[] | []>;
	savePost(post: Post): Promise<void>;
}
