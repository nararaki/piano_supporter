import { Result } from "../../../../packages/lib/index.ts"
import { SchoolCreateData } from "../../../../packages/domain/src/index.ts";
import {School} from "./entity.ts"
export interface schoolRepository{
    createAccount(school:SchoolCreateData):Promise<Result<School>>;
    findById(id:number):Promise<Result<School>>;
    findByShareCode(id:string): Promise<Result<School>>;
}