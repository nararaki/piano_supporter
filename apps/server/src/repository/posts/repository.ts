import type { Post } from "@piano_supporter/common/domains/post.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { createPostData } from "@piano_supporter/common/commonResponseType/honoRequest.ts";

export interface PostsRepository {
	findById(postId: string): Promise<Result<Post>>;
	findByUserId(userId: string): Promise<Post[] | []>;
	savePost(post: Post): Promise<void>;
	findBySchoolId(schoolId: string): Promise<Result<Post[]>>;
	create(post: Post): Promise<Result<void>>;
}
