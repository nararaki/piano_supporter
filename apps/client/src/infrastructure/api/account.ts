import { client } from "@/lib/apiClient";
import { callApi } from "@/lib/apiResponse";
import type { Account } from "@piano_supporter/common/domains/account.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { createServerAccount } from "@piano_supporter/common/domains/account.ts";

/**
 * ユーザーIDに基づいてアカウントを取得
 */
export const getAccountByUserId = async (
	userId: string,
): Promise<Result<Account>> => {
	const result = await callApi<Account>(() =>
		client["account-init"][":userId"].$get({
			param: {
				userId,
			},
		})
	);

	return result;
};

/**
 * 新しいアカウントを作成
 */
export const createAccount = async (
	userId: string,
	lastName: string,
	firstName: string,
	email: string,
): Promise<Result<createServerAccount>> => {
	const result = await callApi<createServerAccount>(() =>
		client["account-init"].$post({
			json: {
				userId,
				lastName,
				firstName,
				email,
			},
		})
	);

	return result;
};

