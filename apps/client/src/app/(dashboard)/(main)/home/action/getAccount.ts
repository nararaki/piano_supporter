import { getAccountByUserId } from "@/infrastructure/api/account";
import type { Account } from "@piano_supporter/common/domains/account.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export const getAccount = async (
	userId: string,
): Promise<Result<Account>> => {
	return await getAccountByUserId(userId);
};
