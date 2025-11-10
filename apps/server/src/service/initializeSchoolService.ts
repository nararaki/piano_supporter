import { SchoolCreateData } from "../../../packages/types/src/index.ts";
import { createSchoolEntity, School } from "../domain/school/entity.ts";
import { schoolRepository } from "../domain/school/repository.ts";

export class InitializeSchoolService {
    constructor(
        private schoolApiRepositry: schoolRepository
    ){}

    async exec(data:SchoolCreateData){
        const schoolData = createSchoolEntity(data);
        const newSchoolData = this.schoolApiRepositry.createAccount(schoolData);
    }
}