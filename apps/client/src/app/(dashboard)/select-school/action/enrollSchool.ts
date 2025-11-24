import { client } from "@/lib/apiClient";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export const enrollSchool = async (
	accountId: string,
	schoolId: string,
): Promise<Result<{ id: string; accountId: string; schoolId: string }>> => {
	const requestBody = {
		accountId: accountId,
		schoolId: schoolId,
	};

	const rawResult = await client['enroll-school'].$post({
		json: requestBody,
	});
	const response = await rawResult.json();
	if (!rawResult.ok) {
		return response;
	}
	return response;
};

