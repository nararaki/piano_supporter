import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import { db } from "../initial.ts";
import { accountSchoolRelation } from "../schema/role.ts";
import { and, eq } from "drizzle-orm";
import type { SchoolMembership } from "@piano_supporter/common/domains/schoolMembership.ts";
import type { SchoolMembershipRepository } from "../../../repository/schoolMembership/repository.ts";

class SchoolMembershipRepositoryClient implements SchoolMembershipRepository {
	async create(membership: SchoolMembership): Promise<Result<SchoolMembership>> {
		try {
			await db.insert(accountSchoolRelation).values({
				id: membership.id,
				accountId: membership.accountId,
				schoolId: membership.schoolId,
			});
			return ok(membership);
		} catch (e) {
			console.log("スクールへの登録に失敗しました", e);
			return err({
				type: "CANNOT_ENROLL_ACCOUNT_TO_SCHOOL",
				message: "スクールへの登録に失敗しました",
			});
		}
	}

	async findByAccountId(accountId: string): Promise<Result<SchoolMembership[]>> {
		try {
			const data = await db
				.select()
				.from(accountSchoolRelation)
				.where(eq(accountSchoolRelation.accountId, accountId))
				.execute();

			const memberships: SchoolMembership[] = data.map((row) => ({
				id: row.id,
				accountId: row.accountId,
				schoolId: row.schoolId,
				createdAt: row.createdAt,
				updatedAt: row.updatedAt,
			}));

			return ok(memberships);
		} catch (e) {
			console.log("スクール登録情報の取得に失敗しました", e);
			return err({
				type: "CANNOT_FIND_SCHOOL",
				message: "スクール登録情報が見つかりません",
			});
		}
	}

	async findByAccountIdAndSchoolId(accountId: string, schoolId: string): Promise<Result<SchoolMembership>> {
		try {
			const [data] = await db
				.select()
				.from(accountSchoolRelation)
				.where(
					and(
						eq(accountSchoolRelation.accountId, accountId),
						eq(accountSchoolRelation.schoolId, schoolId)
					)
				)
				.limit(1)
				.execute();

			if (!data) {
				return err({
					type: "CANNOT_FIND_SCHOOL",
					message: "スクール登録情報が見つかりません",
				});
			}

			return ok(data);
		} catch (e) {
			console.log("スクール登録情報の取得に失敗しました", e);
			return err({
				type: "CANNOT_FIND_SCHOOL",
				message: "スクール登録情報が見つかりません",
			});
		}
	}
}

export const newSchoolMembershipRepositoryClient = new SchoolMembershipRepositoryClient();
