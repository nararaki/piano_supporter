import type { School } from "@piano_supporter/common/domains/school.ts";
import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import { eq } from "drizzle-orm";
import type { schoolRepository } from "../../../repository/school/repository.ts";
import { db } from "../initial.ts";
import { school } from "../schema/school.ts";

class SchoolRepositoryClient implements schoolRepository {
	async create(schoolData: School): Promise<Result<School>> {
		try {
			await db.insert(school).values({
				id: schoolData.id,
				name: schoolData.name,
				email: schoolData.email,
				location: schoolData.location,
				shareCode: schoolData.shareCode,
			});
			return ok(schoolData);
		} catch (e) {
			console.log("教室の作成に失敗しました", e);
			return err({
				type: "CANNOT_CREATE_SCHOOL",
				message: "教室の作成に失敗しました",
			});
		}
	}

	async findById(id: string): Promise<Result<School>> {
		try {
			const [data] = await db
				.select()
				.from(school)
				.where(eq(school.id, id))
				.limit(1)
				.execute();
			if (data) {
				return ok(data as School);
			}
			return err({
				type: "CANNOT_FIND_SCHOOL",
				message: "教室が見つかりません",
			});
		} catch (e) {
			console.log("教室の取得に失敗しました", e);
			return err({
				type: "CANNOT_FIND_SCHOOL",
				message: "教室が見つかりません",
			});
		}
	}

	async findByShareCode(shareCode: string): Promise<Result<School>> {
		try {
			const [data] = await db
				.select()
				.from(school)
				.where(eq(school.shareCode, shareCode))
				.limit(1)
				.execute();
			if (data) {
				return ok(data as School);
			}
			return err({
				type: "CANNOT_FIND_SCHOOL",
				message: "教室が見つかりません",
			});
		} catch (e) {
			console.log("教室の取得に失敗しました", e);
			return err({
				type: "CANNOT_FIND_SCHOOL",
				message: "教室が見つかりません",
			});
		}
	}
}

export const newSchoolRepositoryClient = new SchoolRepositoryClient();
