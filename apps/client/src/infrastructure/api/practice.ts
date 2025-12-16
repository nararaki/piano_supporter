import { client } from "@/lib/apiClient";
import { callApi } from "@/lib/apiResponse";
import type { Practice } from "@piano_supporter/common/domains/practice.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { createPracticeData } from "@piano_supporter/common/commonResponseType/honoRequest.ts";

/**
 * 練習データ一覧を取得
 */
export const getPracticeList = async (
	accountId: string,
	schoolId: string,
): Promise<Result<Practice[]>> => {
	const result = await callApi<Practice[]>(() =>
		client["practice"]["schoolAndAccount"].$get({
			query: {
				accountId,
				schoolId,
			},
		})
	);

	return result;
};

/**
 * 特定の練習データを取得
 */
export const getPracticeById = async (
	practiceId: string,
): Promise<Result<Practice>> => {
	const result = await callApi<Practice>(() =>
		client["practice"][":practiceId"].$get({
			param: {
				practiceId,
			},
		})
	);

	return result;
};

/**
 * 新しい練習データを作成
 */
export const createPractice = async (
	data: createPracticeData,
): Promise<Result<Practice>> => {
	const result = await callApi<Practice>(() =>
		client["practice"].$post({
			json: data,
		})
	);
	return result;
};

