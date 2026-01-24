import { ok, type Result } from "@piano_supporter/common/lib/error.ts";
import { newAccountSchoolRelationRepositoryClient } from "../infrastructure/db/repositories/accountSchoolRelation.ts";
import type { UserContextService } from "./userContextService.ts";
import type { SchoolAccountRelation } from "@piano_supporter/common/domains/schoolAccountRelation.ts";
import type { EnrollAccountToSchoolData } from "@piano_supporter/common/domains/schoolAccountRelation.ts";
import { ROLE_NAMES } from "@piano_supporter/common/domains/role.js";
import type { roleRepository } from "../repository/role/repository.ts";
import type { accountRoleRepository } from "../repository/role/repository.ts";

export class EnrollAccountToSchoolService {
	constructor(private userContextService: UserContextService,
		private roleRepository: roleRepository,
		private accountRoleRepository: accountRoleRepository,
	) {}

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
		const relationResult = await newAccountSchoolRelationRepositoryClient.create(
			data.accountId,
			data.schoolId,
		);
		if (!relationResult.ok) {
			return relationResult;
		}

		const studentRoleResult = await this.roleRepository.findByName(ROLE_NAMES.STUDENT);
		if (!studentRoleResult.ok) {
			return studentRoleResult;
		}

		// アカウントロールを作成
		const accountRoleResult = await this.accountRoleRepository.create(
			relationResult.value.id,
			studentRoleResult.value.id,
		);

		if (!accountRoleResult.ok) {
			return accountRoleResult;
		}

		return ok({
			id: relationResult.value.id,
			accountId: data.accountId,
			schoolId: data.schoolId,
			createdAt: relationResult.value.createdAt,
			updatedAt: relationResult.value.updatedAt,
		});
	}
}

