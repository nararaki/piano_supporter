import { err, ok } from "@piano_supporter/common/lib/error.ts";
import { createSchoolEntity } from "@piano_supporter/common/domains/school.ts";
import type { schoolRepository } from "../repository/school/repository.ts";
import type { accountSchoolRelationRepository } from "../repository/accountSchoolRelation/repository.js";
import { uuidv7 } from "uuidv7";
import type { schoolCreateData } from "@piano_supporter/common/commonResponseType/honoResponse.ts";
import type { accountRoleRepository } from "../repository/role/repository.ts";
import type { roleRepository } from "../repository/role/repository.ts";
import { ROLE_NAMES } from "@piano_supporter/common/domains/role.ts";

export class InitializeSchoolService {
	constructor(
		private schoolApiRepositry: schoolRepository,
		private accountSchoolRelationRepository: accountSchoolRelationRepository,
		private accountRoleRepository: accountRoleRepository,
		private roleRepository: roleRepository,
	) {}

	async exec(data: schoolCreateData) {
		const shareCode = uuidv7();
		const schoolData = createSchoolEntity(data, shareCode);
		const schoolId = uuidv7();
		const newSchoolData = {
			...schoolData,
			id: schoolId,
		}
		console.log("これから学校を作成します");
		const createSchoolResult = await this.schoolApiRepositry.createAccount(newSchoolData);
		if (!createSchoolResult.ok) {
			return createSchoolResult;
		}
		console.log("学校を作成しました");
		const createRelationResult = await this.accountSchoolRelationRepository.create(data.userId, schoolId);
		if (!createRelationResult.ok) {
			return createRelationResult;
		}
		console.log("学校とアカウントを連携しました");

		// adminロールを取得（型安全な定数を使用）
		const adminRoleResult = await this.roleRepository.findByName(ROLE_NAMES.ADMIN);
		if (!adminRoleResult.ok) {
			return adminRoleResult;
		}
		console.log("adminロールを取得しました");

		// アカウントロールを作成
		const accountRoleResult = await this.accountRoleRepository.create(
			createRelationResult.value.id,
			adminRoleResult.value.id,
		);
		console.log("アカウントロールを作成しました");

		if (!accountRoleResult.ok) {
			return accountRoleResult;
		}

		// 作成したスクールのIDを含めて返す
		return ok({
			...createSchoolResult.value,
			id: schoolId,
		});
	}
}
