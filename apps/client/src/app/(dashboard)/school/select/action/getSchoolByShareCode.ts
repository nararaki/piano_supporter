import { getSchoolByShareCode as getSchoolByShareCodeApi } from "@/infrastructure/api/school";
import type { School } from "@piano_supporter/common/domains/school.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export const getSchoolByShareCode = async (
	shareCode: string,
): Promise<Result<School>> => {
	return await getSchoolByShareCodeApi(shareCode);
};

