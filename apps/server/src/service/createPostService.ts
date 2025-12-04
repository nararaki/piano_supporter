import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { Post, CreatePostData } from "@piano_supporter/common/domains/post.ts";
import { err } from "@piano_supporter/common/lib/error.ts";
import type { accountSchoolRelationRepository } from "../repository/accountSchoolRelation/repository.ts";
import type { PostsRepository } from "../repository/posts/repository.ts";

export class CreatePostService {
	constructor(
		private accountSchoolRelationRepository: accountSchoolRelationRepository,
		private postsRepository: PostsRepository,
	) {}

	async exec(data: CreatePostData): Promise<Result<Post>> {
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
				type: "OrgValidaterError",
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
		});

		if (!createResult.ok) {
			return createResult;
		}

		return createResult;
	}
}

