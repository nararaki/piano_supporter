import { client } from "@/lib/apiClient";
import { callApi } from "@/lib/apiResponse";
import type { Practice } from "@piano_supporter/common/domains/practice.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { createPracticeData } from "@piano_supporter/common/commonResponseType/honoResponse.ts";

export const createPractice = async (data: createPracticeData) => {
    const result = await callApi<Result<Practice>>(() =>
        client["practice"].$post({
            json: data,
        })
    );
    if (!result.ok) {
        return result;
    }
    return result.value;
}