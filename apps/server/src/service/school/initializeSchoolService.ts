import { ok } from "@piano_supporter/common/lib/error.ts";
import { createSchoolEntity } from "@piano_supporter/common/domains/school.ts";
import { createSchoolMembershipEntity } from "@piano_supporter/common/domains/schoolMembership.ts";
import type { schoolRepository } from "../../repository/school/repository.ts";
import type { SchoolMembershipRepository } from "../../repository/schoolMembership/repository.ts";
import type { schoolCreateData } from "@piano_supporter/common/commonResponseType/honoRequest.ts";
import type { accountRoleRepository } from "../../repository/role/repository.ts";
import type { roleRepository } from "../../repository/role/repository.ts";
import { ROLE_NAMES } from "@piano_supporter/common/domains/role.ts";

export class InitializeSchoolService {
	constructor(
		private schoolRepository: schoolRepository,
		private schoolMembershipRepository: SchoolMembershipRepository,
		private accountRoleRepository: accountRoleRepository,
		private roleRepository: roleRepository,
	) {}

	async exec(data: schoolCreateData) {
		const school = createSchoolEntity({
			name: data.name,
			email: data.email,
			location: data.location,
		});

		const createSchoolResult = await this.schoolRepository.create(school);
		if (!createSchoolResult.ok) {
			return createSchoolResult;
		}

		const membership = createSchoolMembershipEntity(data.userId, school.id);
		const createMembershipResult = await this.schoolMembershipRepository.create(membership);
		if (!createMembershipResult.ok) {
			return createMembershipResult;
		}

		const adminRoleResult = await this.roleRepository.findByName(ROLE_NAMES.ADMIN);
		if (!adminRoleResult.ok) {
			return adminRoleResult;
		}

		const accountRoleResult = await this.accountRoleRepository.create(
			createMembershipResult.value.id,
			adminRoleResult.value.id,
		);
		if (!accountRoleResult.ok) {
			return accountRoleResult;
		}

		return ok(school);
	}
}
