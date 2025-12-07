import { client } from "@/lib/apiClient";
import { callApi } from "@/lib/apiResponse";
import type { Account } from "@piano_supporter/common/domains/account.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export const getAccount = async (
	userId: string,
): Promise<Result<Account>> => {
	const accountInitClient = client['account-init'] as unknown as {
		[key: string]: { $get: () => Promise<Response> };
	};

	const result = await callApi<Result<Account>>(() =>
		accountInitClient[userId].$get(),
	);

	if (!result.ok) {
		return result;
	}

	// レスポンスボディがResult型の場合、そのまま返す
	return result.value;
};
