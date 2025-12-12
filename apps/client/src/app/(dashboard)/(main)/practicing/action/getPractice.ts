import type { Practice } from "@piano_supporter/common/domains/practice.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";
import { getPracticeList } from "@/infrastructure/api/practice";
import { getSchoolId } from "./getSchool";

export const getPractice = async (accountId: string): Promise<Result<Practice[]>> => {
    //一時的にschoolIdの一番最初を使う。あとで変更する。
    const schoolIdResult = await getSchoolId(accountId);
    if (!schoolIdResult.ok) {
        return schoolIdResult;
    }
    const schoolId = schoolIdResult.value.id;
    return await getPracticeList(accountId, schoolId);
};