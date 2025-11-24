import { client } from "@/lib/apiClient";
import type { createServerAccount } from "@piano_supporter/common/domains/account.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export const createAccount = async (
	userId: string,
	lastName: string,
	firstName: string,
	email: string,
): Promise<Result<createServerAccount>> => {
	const requestBody = {
		userId: userId,
		lastName: lastName,
		firstName: firstName,
		email: email,
	};
	const rawResult = await client['account-init'].$post({
		json: requestBody,
	});
	const response = await rawResult.json();
	if (!rawResult.ok) {
		return response;
	}
	return response;
};

