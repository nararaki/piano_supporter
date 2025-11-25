import type { Post } from "@piano_supporter/common/domains/post.ts";
import type { mockPot } from "@piano_supporter/common/domains/post.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export interface CreatePostData {
	accountId: string;
	schoolId: string;
	title: string;
	content: string;
}

export interface PostsRepository {
	findById(id: number): Promise<Post | null>;
	findByUserId(userId: string): Promise<Post[] | []>;
	savePost(post: Post): Promise<void>;
	findBySchoolId(schoolId: string): Promise<Result<mockPot[]>>;
	create(data: CreatePostData): Promise<Result<mockPot>>;
}
