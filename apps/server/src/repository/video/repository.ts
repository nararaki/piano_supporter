import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { Video } from "@piano_supporter/common/domains/post.ts";

export interface VideoRepository {
	findById(id: string): Promise<Result<Video>>;
	findByPostId(postId: string): Promise<Result<Video | null>>;
	create(data: { postId: string; url: string; type?: string }): Promise<Result<Video>>;
}
