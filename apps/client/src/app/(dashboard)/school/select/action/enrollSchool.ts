import { enrollAccountToSchool } from "@/infrastructure/api/school";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export const enrollSchool = async (
	accountId: string,
	schoolId: string,
): Promise<Result<{ id: string; accountId: string; schoolId: string }>> => {
	return await enrollAccountToSchool(accountId, schoolId);
};

