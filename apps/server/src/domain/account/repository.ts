import { Result } from "../../../../packages/lib/src/error.ts";
import { Account } from "./entity.ts";
export interface AccountRepository {
    findById(id:string) : Promise<Result<Account>>;
    saveAccount(account:Account) : Promise<Result<Account>>;
}