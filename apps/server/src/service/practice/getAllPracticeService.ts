import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { Practice } from "@piano_supporter/common/domains/practice.ts";
import type { PracticeRepository } from "../../repository/practice/repository.ts";
import type { AccountSchoolRelationRepository } from "../../repository/accountSchoolRelation/repository.ts";

export class GetAllPracticeService {
	constructor(
		private practiceRepository: PracticeRepository,
		private accountSchoolRelationRepository: AccountSchoolRelationRepository,
	) {}

	async exec(accountId: string,schoolId: string): Promise<Result<Practice[]>> {
		const accountSchoolRelationResult = await this.accountSchoolRelationRepository.findByAccountIdAndSchoolId(accountId, schoolId);
		if (!accountSchoolRelationResult.ok) {
			return accountSchoolRelationResult;
		}
		const result = await this.practiceRepository.findByRelationId(accountSchoolRelationResult.value.id);
		if (!result.ok) {
			return result;
		}

		return result;
	}
}

