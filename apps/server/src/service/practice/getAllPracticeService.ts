import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { Practice } from "@piano_supporter/common/domains/practice.ts";
import type { PracticeRepository } from "../../repository/practice/repository.ts";
import type { SchoolMembershipRepository } from "../../repository/schoolMembership/repository.ts";

export class GetAllPracticeService {
	constructor(
		private practiceRepository: PracticeRepository,
		private schoolMembershipRepository: SchoolMembershipRepository,
	) {}

	async exec(accountId: string, schoolId: string): Promise<Result<Practice[]>> {
		const membershipResult = await this.schoolMembershipRepository.findByAccountIdAndSchoolId(accountId, schoolId);
		if (!membershipResult.ok) {
			return membershipResult;
		}
		const result = await this.practiceRepository.findByRelationId(membershipResult.value.id);
		if (!result.ok) {
			return result;
		}

		return result;
	}
}
