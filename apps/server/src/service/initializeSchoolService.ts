import type { SchoolCreateData } from "@piano_supporter/common/domains/index.ts";
import { ok } from "@piano_supporter/common/lib/error.ts";
import { createSchoolEntity } from "../domain/school/entity.ts";
import type { schoolRepository } from "../domain/school/repository.ts";
import { uuidv7 } from "uuidv7";
export class InitializeSchoolService {
	constructor(private schoolApiRepositry: schoolRepository) {}

	async exec(data: SchoolCreateData) {
		const schoolData = createSchoolEntity(data);
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
