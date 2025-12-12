import { createAccount as createAccountApi } from "@/infrastructure/api/account";
import type { createServerAccount } from "@piano_supporter/common/domains/account.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export const createAccount = async (
	userId: string,
	lastName: string,
	firstName: string,
	email: string,
): Promise<Result<createServerAccount>> => {
	return await createAccountApi(userId, lastName, firstName, email);
};

