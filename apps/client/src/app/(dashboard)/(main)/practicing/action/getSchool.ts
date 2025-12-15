import { getSchoolsByAccountId } from "@/infrastructure/api/school";
import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { School } from "@piano_supporter/common/domains/school.ts";

// 学校のIDを取得する(一時的にschoolIdの一番最初を使う。あとで変更する。)
export const getSchoolId = async (accountId: string): Promise<Result<School>> => {
	const result = await getSchoolsByAccountId(accountId);
	if (!result.ok) {
		return result;
	}

	return result;
};