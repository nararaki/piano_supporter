import type { School } from "@piano_supporter/common/domains/school.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export interface schoolRepository {
	create(school: School): Promise<Result<School>>;
	findById(id: string): Promise<Result<School>>;
	findByShareCode(id: string): Promise<Result<School>>;
}
