import { client } from "@/lib/apiClient";
import { callApi } from "@/lib/apiResponse";
import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { School } from "@piano_supporter/common/domains/school.ts";
// 学校のIDを取得する(一時的にschoolIdの一番最初を使う。あとで変更する。)
export const getSchoolId = async (accountId: string): Promise<Result<School>> => {
    const result = await callApi<School>(() => 
        client["school"].$get({
            query: {
                accountId,
            },
        })
    );
    
    if (!result.ok) {
        return result;
    }
    console.log("school", result.value);
    return result;
}