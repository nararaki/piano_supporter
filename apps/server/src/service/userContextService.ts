import type { Account } from "@piano_supporter/common/domains/account.ts";
import type { School } from "@piano_supporter/common/domains/school.ts";
import type { UserContext } from "@piano_supporter/common/domains/userContext.ts";
import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import type { AccountRepository } from "../repository/account/repository.ts";
import type { schoolRepository } from "../repository/school/repository.ts";

export class UserContextService {
	constructor(
		private accountRepository: AccountRepository,
		private schoolRepository: schoolRepository,
	) {}

	/**
	 * アカウントとスクールの存在確認を行い、UserContextを返す
	 */
	async validateAccountAndSchool(
		accountId: string,
		schoolId: string,
	): Promise<Result<UserContext>> {
		// アカウントが存在するか確認
		const accountResult = await this.accountRepository.findById(accountId);
		if (!accountResult.ok) {
			return err({
				type: "CANNOT_FIND_ACCOUNT",
				message: "アカウントが見つかりません",
			});
		}

		// スクールが存在するか確認
		const schoolResult = await this.schoolRepository.findById(schoolId);
		if (!schoolResult.ok) {
			return err({
				type: "CANNOT_FIND_SCHOOL",
				message: "スクールが見つかりません",
			});
		}

		return ok({
			account: accountResult.value,
			school: schoolResult.value,
		});
	}

	/**
	 * アカウントの存在確認のみ行う
	 */
	async validateAccount(accountId: string): Promise<Result<Account>> {
		const accountResult = await this.accountRepository.findById(accountId);
		if (!accountResult.ok) {
			return err({
				type: "CANNOT_FIND_ACCOUNT",
				message: "アカウントが見つかりません",
			});
		}
		return ok(accountResult.value);
	}

	/**
	 * スクールの存在確認のみ行う
	 */
	async validateSchool(schoolId: string): Promise<Result<School>> {
		const schoolResult = await this.schoolRepository.findById(schoolId);
		if (!schoolResult.ok) {
			return err({
				type: "CANNOT_FIND_SCHOOL",
				message: "スクールが見つかりません",
			});
		}
		return ok(schoolResult.value);
	}
}

