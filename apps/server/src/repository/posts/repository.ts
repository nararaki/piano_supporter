import type { Post } from "@piano_supporter/common/domains/post.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export interface CreatePostData {
	accountId: string;
	schoolId: string;
	title: string;
	content: string;
	videoUrl?: string;
}

export interface PostsRepository {
	findById(id: number): Promise<Post | null>;
	findByUserId(userId: string): Promise<Post[] | []>;
	savePost(post: Post): Promise<void>;
	findBySchoolId(schoolId: string): Promise<Result<Post[]>>;
	create(data: CreatePostData): Promise<Result<Post>>;
}
