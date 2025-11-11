import { err, ok, Result } from "../../../../../packages/lib/src/error.ts";
import { Account, createServerAccount } from "../../../../../packages/domain/src/index.ts";
import { AccountRepository } from "../../../domain/account/repository.ts";
import { db } from "../initial.ts";
import { accounts } from "../schema/account.ts";
import { eq } from "drizzle-orm";

export class AccountRespositoryClient implements AccountRepository{
    async createAccount(account: createServerAccount): Promise<Result<createServerAccount>> {
        try{
            console.log("dbにinsert開始します...")
            await db
                .insert(accounts)
                .values({
                    ...account,
                })
                .onDuplicateKeyUpdate({
                // 重複が発生した場合、これらのフィールドを新しい値で更新する
                set: {
                    lastName: account.lastName,
                    firstName: account.firstName,
                    email: account.email,
                }});
            return ok(account);
        }catch(e){
            console.log("データベースエラー",e);
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
