import type {
	Account,
	createServerAccount,
} from "../../../../packages/domain/src/index.ts";
import type { Result } from "../../../../packages/lib/src/error.ts";
export interface AccountRepository {
	findById(id: string): Promise<Result<Account>>;
	createAccount(
		account: createServerAccount,
	): Promise<Result<createServerAccount>>;
}
