import type { SchoolCreateData } from "@piano_supporter/common/domains/index.ts";
import { ok } from "@piano_supporter/common/lib/error.ts";
import { createSchoolEntity } from "../domain/school/entity.ts";
import type { schoolRepository } from "../domain/school/repository.ts";

export class InitializeSchoolService {
	constructor(private schoolApiRepositry: schoolRepository) {}

	async exec(data: SchoolCreateData) {
		const schoolData = createSchoolEntity(data);
		const result = await this.schoolApiRepositry.createAccount(schoolData);
		if (!result.ok) {
			return result;
		}
		return ok(result.value);
	}
}
