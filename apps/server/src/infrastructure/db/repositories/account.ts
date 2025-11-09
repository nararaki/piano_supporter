import { err, ok, Result } from "../../../../../packages/lib/src/error.ts";
import { Account } from "../../../domain/account/entity.ts";
import { AccountRepository } from "../../../domain/account/repository.ts";
import { db } from "../initial.ts";
import { accounts } from "../schema/account.ts";
import { eq } from "drizzle-orm";

export class AccountRespositoryClient implements AccountRepository{
    async saveAccount(account: Account): Promise<Result<Account>> {
        try{
            await db
                .insert(accounts)
                .values({
                    ...account,
                    createdAt:account.createdAt ?? undefined,
                    updatedAt:account.updatedAt ?? undefined,
                });
            return ok(account);
        }catch(e){
            return err({
                type: 'UNEXPECTED',
                message: "データベースへのinsert中にエラーが発生しました"
            });
        }
    }

    async findById(id: string): Promise<Result<Account>> {
        try{
            const [result] = await db
                            .select()
                            .from(accounts)
                            .where(eq(accounts.id,id))
                            .limit(1).execute();
            const account = result as Account;
            return ok(account);
        }catch(e){
            return err({
                type:'UNEXPECTED',
               message: "データベースからの取得に失敗しました"
            })
        }
    }
}

export const newAccountRespositoryClient = new AccountRespositoryClient();
