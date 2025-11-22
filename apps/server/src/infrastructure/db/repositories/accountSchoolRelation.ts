import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import { db } from "../initial.ts";
import { accountSchoolRelation } from "../schema/role.ts";
import { uuidv7 } from "uuidv7";

export interface AccountSchoolRelationData {
	id: string;
	accountId: string;
	schoolId: string;
}

class AccountSchoolRelationRepository {
	async create(
		accountId: string,
		schoolId: string,
	): Promise<Result<AccountSchoolRelationData>> {
		try {
			const relationId = uuidv7();
			await db.insert(accountSchoolRelation).values({
				id: relationId,
				accountId,
				schoolId,
			});
			return ok({
				id: relationId,
				accountId,
				schoolId,
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

