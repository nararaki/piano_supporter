import { Account } from "./entity";
export interface AccountRepository {
    findById(id:number) : Promise<Account | null>;
    findByClerkId(clerkId:string) : Promise<Account | null>;
    saveAccount(account:Account) : Promise<void>;
}