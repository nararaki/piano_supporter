import type {
	Account,
	createServerAccount,
} from "@piano_supporter/common/domains/account.ts";
import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import { eq } from "drizzle-orm";
import type { AccountRepository } from "../../../repository/account/repository.ts";
import { db } from "../initial.ts";
import { account } from "../schema/account.ts";

export class AccountRespositoryClient implements AccountRepository {
	async createAccount(
		accountData: createServerAccount,
	): Promise<Result<createServerAccount>> {
		try {
			console.log("dbにinsert開始します...");
			await db
				.insert(account)
				.values({
					...accountData,
				});
			return ok(accountData);
		} catch (e) {
			console.log("データベースエラー", e);
			return err({
				type: "UNEXPECTED",
				message: "データベースへのinsert中にエラーが発生しました",
			});
		}
	}

	async findById(id: string): Promise<Result<Account>> {
		try {
			const [result] = await db
				.select()
				.from(account)
				.where(eq(account.id, id))
				.limit(1)
				.execute();
			if(result){
				const accountData = result as Account;
				return ok(accountData);
			}
			return err({
				type: "CANNOT_FIND_ACCOUNT",
				message: "アカウントが見つかりません",
			});
		} catch (e) {
			return err({
				type: "UNEXPECTED",
				message: "データベースからの取得に失敗しました",
			});
		}
	}
}

export const newAccountRespositoryClient = new AccountRespositoryClient();
