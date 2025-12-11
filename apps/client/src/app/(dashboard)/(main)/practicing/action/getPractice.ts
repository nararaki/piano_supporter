import { client } from "@/lib/apiClient";
import { callApi } from "@/lib/apiResponse";
import type { Practice } from "@piano_supporter/common/domains/practice.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";
import { getSchoolId } from "./getSchool";

export const getPractice = async (accountId: string): Promise<Result<Practice[]>> => {
    //一時的にschoolIdの一番最初を使う。あとで変更する。
    const schoolIdResult = await getSchoolId(accountId);
    if (!schoolIdResult.ok) {
        return schoolIdResult;
    }
    const schoolId = schoolIdResult.value.id;
    const result = await callApi<Result<Practice[]>>(() => 
        client["practice"]["schoolAndAccount"].$get({
        query: {
            accountId,
            schoolId,
        },
    }));
    
    if (!result.ok) {
        return result;
    }

    return result.value;
};