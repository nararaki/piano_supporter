import { client } from "@/lib/apiClient";
import { callApi } from "@/lib/apiResponse";
import type { Practice } from "@piano_supporter/common/domains/practice.ts";
import type { createPracticeData } from "@piano_supporter/common/commonResponseType/honoResponse.ts";

export const createPractice = async (data: createPracticeData) => {
    console.log("data", data);
    const result = await callApi<Practice>(() =>
        client["practice"].$post({
            json: data,
        })
    );
    console.log("result", result);
    if (!result.ok) {
        return result;
    }
    return result;
}