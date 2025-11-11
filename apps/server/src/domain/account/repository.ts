import { Result } from "../../../../packages/lib/src/error.ts";
import { Account, AccountCreateData, createServerAccount } from "../../../../packages/domain/src/index.ts";
export interface AccountRepository {
    findById(id:string) : Promise<Result<Account>>;
    createAccount(account:createServerAccount) : Promise<Result<createServerAccount>>;
}