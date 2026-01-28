import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import { createAccountEntity, type createServerAccount } from "@piano_supporter/common/domains/account.ts";
import type { AccountRepository } from "../../repository/account/repository.ts";

export class InitializeAccountService {
	constructor(private accountRepository: AccountRepository) {}

	async exec(
		userId: string,
		lastName: string,
		firstName: string,
		email: string,
	): Promise<Result<createServerAccount>> {
		const newAccuont = createAccountEntity(userId, lastName, firstName, email);
		const result = await this.accountRepository.createAccount(newAccuont);
		console.log(result);
		if (!result.ok) {
			return err({
				type: "CANNOT_CREATE_ACCOUNT",
				message: "アカウント登録に失敗しました",
			});
		}
		return ok(result.value);
	}
}
