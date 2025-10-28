import {err,Result,ok} from "../../lib/error"; 
import { Account } from "../account/entity";

export class AccountValidater {
    constructor(
        public account:Account,
    ){}
    exec():Result<boolean>{
        if(this.account.id == null || this.account.clerkUserId == null){
            return err({
                type:"AccountValidaterError",
                message:"ユーザー認証をしてください",
            });
        }

        if(this.account.organizationId == null){
            return err({
                type:"OrgValidaterError",
                message:"教室に所属していません",
            });
        }

        return ok(true);
    }
}

