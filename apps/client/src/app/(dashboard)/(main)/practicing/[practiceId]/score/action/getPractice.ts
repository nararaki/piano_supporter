import { client } from "@/lib/apiClient";
import { callApi } from "@/lib/apiResponse";
import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { Practice } from "@piano_supporter/common/domains/practice.ts";

export const getPractice = async (practiceId: string) => {
    const result = await callApi<Practice>(() => 
        client["practice"][":practiceId"].$get({
        param: {
            practiceId,
        },
    }));
    return result;
};  