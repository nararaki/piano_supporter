import { ok, type Result } from "@piano_supporter/common/lib/error.ts";
import { newAccountSchoolRelationRepository } from "../infrastructure/db/repositories/accountSchoolRelation.ts";
import type { UserContextService } from "./userContextService.ts";
import type { SchoolAccountRelation } from "@piano_supporter/common/domains/schoolAccountRelation.ts";
import type { EnrollAccountToSchoolData } from "@piano_supporter/common/domains/schoolAccountRelation.ts";

export class EnrollAccountToSchoolService {
	constructor(private userContextService: UserContextService) {}

	async exec(data: EnrollAccountToSchoolData): Promise<Result<SchoolAccountRelation>> {
		// アカウントとスクールの存在確認
		const contextResult = await this.userContextService.validateAccountAndSchool(
			data.accountId,
			data.schoolId,
		);
		if (!contextResult.ok) {
			return contextResult;
		}

		// アカウントとスクールを連携
		const relationResult = await newAccountSchoolRelationRepository.create(
			data.accountId,
			data.schoolId,
		);

		if (!relationResult.ok) {
			return relationResult;
		}

		return ok(relationResult.value);
	}
}

