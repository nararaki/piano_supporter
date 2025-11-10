import { Result } from "../../../../packages/lib/src/error.ts";
import { Account, AccountCreateData } from "../../../../packages/types/src/index.ts";
export interface AccountRepository {
    findById(id:string) : Promise<Result<Account>>;
    createAccount(account:AccountCreateData) : Promise<Result<AccountCreateData>>;
}