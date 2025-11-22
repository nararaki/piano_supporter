import type {
	createSchoolDatabase,
	createServerSchool,
	School,
} from "@piano_supporter/common/domains/school.ts";
import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import { eq } from "drizzle-orm";
import type { schoolRepository } from "../../../repository/school/repository.ts";
import { db } from "../initial.ts";
import { school } from "../schema/school.ts";

class SchoolRepositoryClient implements schoolRepository {
	async createAccount(
		schoolData: createSchoolDatabase,
	): Promise<Result<createServerSchool>> {
		try {
			console.log("dbへのinsert開始します...");
			const result = await db
				.insert(school)
				.values(schoolData)
				.$returningId();
			console.log("dbへのinsert成功しました", result);
			return ok({
				...schoolData,
			});
		} catch (e) {
			console.log("sippai", e);
			return err({
				type: "CANNOT_CREATE_SCHOOL",
				message: "データベースエラー教室の作成に失敗しました",
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
				const result = data as School;
				return ok(result);
			}
			return err({
				type: "CANNOT_FIND_SCHOOL",
				message: "教室が見つかりません",
			});
		} catch (e) {
			return err({
				type: "CANNOT_FIND_SCHOOL",
				message: "教室が見つかりません",
			});
		}
	}

	async findByShareCode(id: string): Promise<Result<School>> {
		try {
			const [data] = await db
				.select()
				.from(school)
				.where(eq(school.shareCode, id))
				.limit(1)
				.execute();
			if (data) {
				const result = data as School;
				return ok(result);
			}
			return err({
				type: "CANNOT_FIND_SCHOOL",
				message: "教室が見つかりません",
			});
		} catch (e) {
			return err({
				type: "CANNOT_FIND_SCHOOL",
				message: "教室が見つかりません",
			});
		}
	}
}

export const newSchoolRepositoryClient = new SchoolRepositoryClient();
