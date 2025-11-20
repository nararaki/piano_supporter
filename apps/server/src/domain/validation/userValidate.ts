import {err,Result,ok} from "../../../../packages/lib/src/error.ts"; 
import { Account } from "../../../../packages/domain/src/index.ts";

export class AccountValidater {
    constructor(
        public account:Account,
    ){}
    exec():Result<boolean>{
        if(this.account.id == null || this.account.id == null){
            return err({
                type:"AccountValidaterError",
                message:"ユーザー認証をしてください",
            });
        }
        return ok(true);
    }
}

