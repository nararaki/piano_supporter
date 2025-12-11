import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { Post } from "@piano_supporter/common/domains/post.ts";
import { err } from "@piano_supporter/common/lib/error.ts";
import type { AccountSchoolRelationRepository } from "../../repository/accountSchoolRelation/repository.ts";
import type { PostsRepository } from "../../repository/posts/repository.ts";

export class GetAllPostsService {
	constructor(
		private accountSchoolRelationRepository: AccountSchoolRelationRepository,
		private postsRepository: PostsRepository,
	) {}

	async exec(accountId: string): Promise<Result<Post[]>> {
		// accountIdからAccountSchoolRelationを検索
		const relationsResult = await this.accountSchoolRelationRepository.findByAccountId(accountId);
		
		if (!relationsResult.ok) {
			return err({
				type: "CANNOT_FIND_SCHOOL",
				message: "スクールに登録されていません",
			});
		}
		console.log("relationsResult", relationsResult);
		const relations = relationsResult.value;
		
		// 結果の[0]番目のschoolIdを取得
		if (relations.length === 0) {
			return err({
				type: "CANNOT_FIND_SCHOOL",
				message: "教室に所属していません",
			});
		}
		console.log("relations", relations);
		const schoolId = relations[0].schoolId;

		// 取得したschoolIdをもつ投稿を取得
		const postsResult = await this.postsRepository.findBySchoolId(schoolId);
		console.log("postsResult", postsResult);
		if (!postsResult.ok) {
			return postsResult;
		}

		return postsResult;
	}
}

