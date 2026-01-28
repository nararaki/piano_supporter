import { ok, type Result } from "@piano_supporter/common/lib/error.ts";
import { newSchoolMembershipRepositoryClient } from "../../infrastructure/db/repositories/schoolMembership.ts";
import type { UserContextService } from "../userContextService.ts";
import type { SchoolMembership } from "@piano_supporter/common/domains/schoolMembership.ts";
import { type EnrollAccountToSchoolData, createSchoolMembershipEntity } from "@piano_supporter/common/domains/schoolMembership.ts";
import { ROLE_NAMES } from "@piano_supporter/common/domains/role.js";
import type { roleRepository } from "../../repository/role/repository.ts";
import type { accountRoleRepository } from "../../repository/role/repository.ts";

export class EnrollAccountToSchoolService {
	constructor(private userContextService: UserContextService,
		private roleRepository: roleRepository,
		private accountRoleRepository: accountRoleRepository,
	) {}

	async exec(data: EnrollAccountToSchoolData): Promise<Result<SchoolMembership>> {
		const contextResult = await this.userContextService.validateAccountAndSchool(
			data.accountId,
			data.schoolId,
		);
		if (!contextResult.ok) {
			return contextResult;
		}

		const membership = createSchoolMembershipEntity(data.accountId, data.schoolId);
		const membershipResult = await newSchoolMembershipRepositoryClient.create(membership);
		if (!membershipResult.ok) {
			return membershipResult;
		}

		const studentRoleResult = await this.roleRepository.findByName(ROLE_NAMES.STUDENT);
		if (!studentRoleResult.ok) {
			return studentRoleResult;
		}

		const accountRoleResult = await this.accountRoleRepository.create(
			membershipResult.value.id,
			studentRoleResult.value.id,
		);

		if (!accountRoleResult.ok) {
			return accountRoleResult;
		}

		return ok(membershipResult.value);
	}
}
