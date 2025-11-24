import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import { db } from "../initial.ts";
import { accountSchoolRelation } from "../schema/role.ts";
import { uuidv7 } from "uuidv7";
import type { SchoolAccountRelation } from "@piano_supporter/common/domains/schoolAccountRelation.ts";
import type { accountSchoolRelationRepository } from "../../../repository/accountSchoolRelation/repository.js";

class AccountSchoolRelationRepository implements accountSchoolRelationRepository {
	async create(
		accountId: string,
		schoolId: string,
	): Promise<Result<SchoolAccountRelation>> {
		try {
			const relationId = uuidv7();
			await db.insert(accountSchoolRelation).values({
				id: relationId,
				accountId,
				schoolId,
			});
			const now = new Date();
			return ok({
				id: relationId,
				accountId,
				schoolId,
				createdAt: now,
				updatedAt: now
			});
		} catch (e) {
			console.log("アカウントとスクールの連携に失敗しました", e);
			return err({
				type: "CANNOT_ENROLL_ACCOUNT_TO_SCHOOL",
				message: "アカウントとスクールの連携に失敗しました",
			});
		}
	}
}

export const newAccountSchoolRelationRepository = new AccountSchoolRelationRepository();

