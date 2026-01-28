import type { School } from "@piano_supporter/common/domains/school.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { SchoolMembershipRepository } from "src/repository/schoolMembership/repository.ts";
import type { schoolRepository } from "src/repository/school/repository.ts";

export class GetSchoolService {
	constructor(
		private schoolMembershipRepository: SchoolMembershipRepository,
		private schoolRepository: schoolRepository,
	) {}

	async exec(accountId: string): Promise<Result<School>> {
		const result = await this.schoolMembershipRepository.findByAccountId(accountId);
		if (!result.ok) {
			return result;
		}
		const schoolIds = result.value.map((membership) => membership.schoolId);
		const school = await this.schoolRepository.findById(schoolIds[0]);
		if (!school.ok) {
			return school;
		}
		return school;
	}
}
