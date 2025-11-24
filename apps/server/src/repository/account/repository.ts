import type {
	Account,
	createServerAccount,
} from "@piano_supporter/common/domains/account.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export interface AccountRepository {
	findById(id: string): Promise<Result<Account>>;
	createAccount(
		account: createServerAccount,
	): Promise<Result<createServerAccount>>;
}
