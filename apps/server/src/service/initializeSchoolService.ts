import type { SchoolCreateData } from "@piano_supporter/common/domains/school.ts";
import { ok } from "@piano_supporter/common/lib/error.ts";
import { createSchoolEntity } from "@piano_supporter/common/domains/school.ts";
import type { schoolRepository } from "../repository/school/repository.ts";
import { uuidv7 } from "uuidv7";
export class InitializeSchoolService {
	constructor(private schoolApiRepositry: schoolRepository) {}

	async exec(data: SchoolCreateData) {
		const schoolData = createSchoolEntity(data, uuidv7());
		const newSchoolData = {
			...schoolData,
			id: uuidv7(),
		}
		const result = await this.schoolApiRepositry.createAccount(newSchoolData);
		if (!result.ok) {
			return result;
		}
		return ok(result.value);
	}
}
