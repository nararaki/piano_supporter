import { getSchoolShareCode as getSchoolShareCodeApi } from "@/infrastructure/api/school";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export const getSchoolShareCode = async (
	schoolId: string,
): Promise<Result<string>> => {
	return await getSchoolShareCodeApi(schoolId);
};

