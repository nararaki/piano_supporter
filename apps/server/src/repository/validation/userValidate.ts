import type { Account } from "@piano_supporter/common/domains/account.ts";
import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";

export class AccountValidater {
	constructor(public account: Account) {}
	exec(): Result<boolean> {
		if (this.account.id == null || this.account.id == null) {
			return err({
				type: "AccountValidaterError",
				message: "ユーザー認証をしてください",
			});
		}
		return ok(true);
	}
}
