import { client } from "@/lib/apiClient";
import { callApi } from "@/lib/apiResponse";
import type { Result } from "@piano_supporter/common/lib/error.ts";

// 学校のIDを取得する(一時的にschoolIdの一番最初を使う。あとで変更する。)
export const getSchoolId = async (accountId: string): Promise<Result<string>> => {
    const result = await callApi<string>(() => 
        client["school"].$get({
            query: {
                accountId,
            },
        })
    );
    
    if (!result.ok) {
        return result;
    }

    return result;
}