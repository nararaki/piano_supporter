import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { createSchoolDatabase } from "@piano_supporter/common/domains/index.ts";
import type { School } from "@piano_supporter/common/domains/index.ts";
import type { createServerSchool } from "@piano_supporter/common/domains/index.ts";
export interface schoolRepository{
    createAccount(school:createSchoolDatabase):Promise<Result<createServerSchool>>;
    findById(id:number):Promise<Result<School>>;
    findByShareCode(id:string): Promise<Result<School>>;
}