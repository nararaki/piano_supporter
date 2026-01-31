import type { Result } from "@piano_supporter/common/lib/error.ts";
import { err, ok } from "@piano_supporter/common/lib/error.ts";
import type { SchoolMembershipRepository } from "../../repository/schoolMembership/repository.ts";
import type { PostsRepository } from "../../repository/posts/repository.ts";
import type { VideoRepository } from "../../repository/video/repository.ts";
import type { createPostData } from "@piano_supporter/common/commonResponseType/honoRequest.ts";
import { createPostEntity } from "@piano_supporter/common/domains/post.ts";

export class CreatePostService {
	constructor(
		private schoolMembershipRepository: SchoolMembershipRepository,
		private postsRepository: PostsRepository,
		private videoRepository: VideoRepository,
	) {}

	async exec(data: createPostData): Promise<Result<void>> {
		const membershipsResult = await this.schoolMembershipRepository.findByAccountId(data.accountId);

		if (!membershipsResult.ok) {
			return err({
				type: "CANNOT_FIND_SCHOOL",
				message: "スクールに登録されていません",
			});
		}

		const memberships = membershipsResult.value;

		if (memberships.length === 0) {
			return err({
				type: "CANNOT_FIND_SCHOOL",
				message: "教室に所属していません",
			});
		}

		const membershipId = memberships[0].id;

		const post = createPostEntity({
			accountRelationId: membershipId,
			title: data.title,
			content: data.content,
		});

		const createResult = await this.postsRepository.create(post);

		if (!createResult.ok) {
			return createResult;
		}

		if (!data.videoUrl || !data.videoType) {
			return err({
				type: "BAD_REQUEST",
				message: "動画URLと動画タイプは必須です",
			});
		}

		const videoResult = await this.videoRepository.create({
			postId: post.id,
			url: data.videoUrl,
			type: data.videoType,
		});

		if (!videoResult.ok) {
			return videoResult;
		}

		return ok(undefined);
	}
}
