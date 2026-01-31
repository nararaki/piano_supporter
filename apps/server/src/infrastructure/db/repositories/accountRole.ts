import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import { uuidv7 } from "uuidv7";
import type { accountRoleRepository } from "../../../repository/role/repository.ts";
import { db } from "../initial.ts";
import { accountRoles } from "../schema/role.ts";

class AccountRoleRepositoryClient implements accountRoleRepository {
	async create(
		accountSchoolRelationId: string,
		roleId: string,
	): Promise<
		Result<{ id: string; accountSchoolRelationId: string; roleId: string }>
	> {
		try {
			const accountRoleId = uuidv7();
			await db.insert(accountRoles).values({
				id: accountRoleId,
				accountSchoolRelationId,
				roleId,
			});
			return ok({
				id: accountRoleId,
				accountSchoolRelationId,
				roleId,
			});
		} catch (e) {
			console.log("アカウントロールの作成に失敗しました", e);
			return err({
				type: "UNEXPECTED",
				message: "アカウントロールの作成に失敗しました",
			});
		}
	}
}

export const newAccountRoleRepositoryClient = new AccountRoleRepositoryClient();
