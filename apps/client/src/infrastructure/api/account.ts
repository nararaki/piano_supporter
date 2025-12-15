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
	const accountInitClient = client["account-init"] as unknown as {
		[key: string]: { $get: () => Promise<Response> };
	};

	const result = await callApi<Result<Account>>(() =>
		accountInitClient[userId].$get()
	);

	if (!result.ok) {
		return result;
	}

	return result.value;
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
	const result = await callApi<Result<createServerAccount>>(() =>
		client["account-init"].$post({
			json: {
				userId,
				lastName,
				firstName,
				email,
			},
		})
	);

	if (!result.ok) {
		return result;
	}

	return result.value;
};

