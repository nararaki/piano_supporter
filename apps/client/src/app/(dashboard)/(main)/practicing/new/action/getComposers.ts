import { client } from "@/lib/apiClient";
import { callApi } from "@/lib/apiResponse";
import type { Composer } from "@piano_supporter/common/domains/composer.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export const getComposers = async (): Promise<Result<Composer[]>> => {
    const result = await callApi<Result<Composer[]>>(() => 
        client["composers"].$get()
    );
    
    if (!result.ok) {
        return result;
    }

    return result.value;
};

