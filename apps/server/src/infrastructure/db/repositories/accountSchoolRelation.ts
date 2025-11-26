import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import { db } from "../initial.ts";
import { accountSchoolRelation } from "../schema/role.ts";
import { uuidv7 } from "uuidv7";
import { eq } from "drizzle-orm";
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

	async findByAccountId(accountId: string): Promise<Result<SchoolAccountRelation[]>> {
		try {
			const data = await db
				.select()
				.from(accountSchoolRelation)
				.where(eq(accountSchoolRelation.accountId, accountId))
				.execute();
			
			const relations: SchoolAccountRelation[] = data.map((row) => ({
				id: row.id,
				accountId: row.accountId,
				schoolId: row.schoolId,
				createdAt: row.createdAt,
				updatedAt: row.updatedAt,
			}));
			
			return ok(relations);
		} catch (e) {
			console.log("アカウントとスクールの関係取得に失敗しました", e);
			return err({
				type: "CANNOT_FIND_SCHOOL",
				message: "スクールが見つかりません",
			});
		}
	}
}

export const newAccountSchoolRelationRepository = new AccountSchoolRelationRepository();

