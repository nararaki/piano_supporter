import { School } from "@piano_supporter/common/domains/school.js";
import { Result } from "@piano_supporter/common/lib/error.js";
import { AccountSchoolRelationRepository } from "src/repository/accountSchoolRelation/repository.ts";
import type { schoolRepository } from "src/repository/school/repository.ts";
export class GetSchoolService {
	constructor(
		private accountSchoolRelationRepository: AccountSchoolRelationRepository,
        private schoolRepository: schoolRepository,
	) {}

	async exec(accountId: string): Promise<Result<School>> {
		const result = await this.accountSchoolRelationRepository.findByAccountId(accountId);
		if (!result.ok) {
			return result;
		}
        const schoolIds = result.value.map((relation) => relation.schoolId);
        const school = await this.schoolRepository.findById(schoolIds[0]);
        if (!school.ok) {
            return school;
        }
		return school;
	}
}
