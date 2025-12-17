import { client } from "@/infrastructure/api/apiClient";
import { callApi } from "@/infrastructure/api/apiResponse";
import type { Composer } from "@piano_supporter/common/domains/composer.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

/**
 * 作曲家一覧を取得
 */
export const getComposers = async (): Promise<Result<Composer[]>> => {
	const result = await callApi<Composer[]>(() =>
		client["composers"].$get({
		})
	);
	return result;
};

