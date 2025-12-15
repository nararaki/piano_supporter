import { client } from "@/lib/apiClient";
import { callApi } from "@/lib/apiResponse";
import type { Practice } from "@piano_supporter/common/domains/practice.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { createPracticeData } from "@piano_supporter/common/commonResponseType/honoResponse.ts";

/**
 * 練習データ一覧を取得
 */
export const getPracticeList = async (
	accountId: string,
	schoolId: string,
): Promise<Result<Practice[]>> => {
	const result = await callApi<Result<Practice[]>>(() =>
		client["practice"]["schoolAndAccount"].$get({
			query: {
				accountId,
				schoolId,
			},
		})
	);

	if (!result.ok) {
		return result;
	}

	return result.value;
};

/**
 * 特定の練習データを取得
 */
export const getPracticeById = async (
	practiceId: string,
): Promise<Result<Practice>> => {
	const result = await callApi<Result<Practice>>(() =>
		client["practice"][":practiceId"].$get({
			param: {
				practiceId,
			},
		})
	);

	if (!result.ok) {
		return result;
	}

	return result.value;
};

/**
 * 新しい練習データを作成
 */
export const createPractice = async (
	data: createPracticeData,
): Promise<Result<Practice>> => {
	const result = await callApi<Result<Practice>>(() =>
		client["practice"].$post({
			json: data,
		})
	);
	if (!result.ok) {
		return result;
	}
	return result.value;
};

