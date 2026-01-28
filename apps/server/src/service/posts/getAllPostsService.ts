import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { Post } from "@piano_supporter/common/domains/post.ts";
import { err } from "@piano_supporter/common/lib/error.ts";
import type { SchoolMembershipRepository } from "../../repository/schoolMembership/repository.ts";
import type { PostsRepository } from "../../repository/posts/repository.ts";

export class GetAllPostsService {
	constructor(
		private schoolMembershipRepository: SchoolMembershipRepository,
		private postsRepository: PostsRepository,
	) {}

	async exec(accountId: string): Promise<Result<Post[]>> {
		const membershipsResult = await this.schoolMembershipRepository.findByAccountId(accountId);

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

		const schoolId = memberships[0].schoolId;

		const postsResult = await this.postsRepository.findBySchoolId(schoolId);
		if (!postsResult.ok) {
			return postsResult;
		}

		return postsResult;
	}
}
