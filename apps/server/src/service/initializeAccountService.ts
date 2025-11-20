import { err, ok } from "@piano_supporter/common/lib/error.ts";
import { createAccountEntity } from "../domain/account/entity.ts";
import type { AccountRepository } from "../domain/account/repository.ts";

export class InitializeAccountService {
	constructor(private accountRepository: AccountRepository) {}

	async exec(
		userId: string,
		lastName: string,
		firstName: string,
		email: string,
	) {
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
