import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { Post } from "@piano_supporter/common/domains/post.ts";
import { err } from "@piano_supporter/common/lib/error.ts";
import type { AccountSchoolRelationRepository } from "../../repository/accountSchoolRelation/repository.ts";
import type { PostsRepository } from "../../repository/posts/repository.ts";
import type { VideoRepository } from "../../repository/video/repository.ts";
import type { createPostData } from "@piano_supporter/common/commonResponseType/honoRequest.ts";
export class CreatePostService {
	constructor(
		private accountSchoolRelationRepository: AccountSchoolRelationRepository,
		private postsRepository: PostsRepository,
		private videoRepository: VideoRepository,
	) {}

	async exec(data: createPostData): Promise<Result<Post>> {
		// accountIdからAccountSchoolRelationを検索
		const relationsResult = await this.accountSchoolRelationRepository.findByAccountId(data.accountId);
		
		if (!relationsResult.ok) {
			return err({
				type: "CANNOT_FIND_SCHOOL",
				message: "スクールに登録されていません",
			});
		}

		const relations = relationsResult.value;
		
		// 結果の[0]番目のschoolIdを取得
		if (relations.length === 0) {
			return err({
				type: "CANNOT_FIND_SCHOOL",
				message: "教室に所属していません",
			});
		}

		const schoolId = relations[0].schoolId;

		// 投稿を作成
		const createResult = await this.postsRepository.create({
			accountId: data.accountId,
			schoolId: schoolId,
			title: data.title,
			content: data.content,
			videoUrl: data.videoUrl,
			videoType: data.videoType,
		});

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
			postId: createResult.value.id,
			url: data.videoUrl,
			type: data.videoType,
		});

		if (!videoResult.ok) {
			return videoResult;
		}

		return createResult;
	}
}

