import {err, ok} from "../../../packages/lib/src/error.ts"
import { SchoolCreateData } from "../../../packages/domain/src/index.ts";
import { createSchoolEntity, School } from "../domain/school/entity.ts";
import { schoolRepository } from "../domain/school/repository.ts";

export class InitializeSchoolService {
    constructor(
        private schoolApiRepositry: schoolRepository
    ){}

    async exec(data:SchoolCreateData){
        const schoolData = createSchoolEntity(data);
        const result = await this.schoolApiRepositry.createAccount(schoolData);
        if(!result.ok){
            return result;
        }
        return ok(result.value);
    }
}