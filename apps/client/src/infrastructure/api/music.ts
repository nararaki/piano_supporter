import { client } from "@/infrastructure/api/apiClient";
import { callApi } from "@/infrastructure/api/apiResponse";
import type { Music } from "@piano_supporter/common/domains/music.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

/**
 * 作曲家IDに基づいて楽曲一覧を取得
 */
export const getMusicsByComposerId = async (
	composerId: string,
): Promise<Result<Music[]>> => {
	const result = await callApi<Music[]>(() =>
		client["musics"][":composerId"].$get({
			param: {
				composerId,
			},
		})
	);
	return result;
};

