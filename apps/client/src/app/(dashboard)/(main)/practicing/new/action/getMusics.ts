import { client } from "@/lib/apiClient";
import { callApi } from "@/lib/apiResponse";
import type { Music } from "@piano_supporter/common/domains/music.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export const getMusics = async (composerId: string): Promise<Result<Music[]>> => {
    const result = await callApi<Result<Music[]>>(() => 
        client["musics"].$get({
            query: {
                composerId,
            },
        })
    );
    
    if (!result.ok) {
        return result;
    }

    return result.value;
};

