import type {
	createSchoolDatabase,
	createServerSchool,
	School,
} from "@piano_supporter/common/domains/school.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";
export interface schoolRepository {
	createAccount(
		school: createSchoolDatabase,
	): Promise<Result<createServerSchool>>;
	findById(id: string): Promise<Result<School>>;
	findByShareCode(id: string): Promise<Result<School>>;
}
