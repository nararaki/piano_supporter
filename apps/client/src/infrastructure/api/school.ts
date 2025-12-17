import { client } from "@/infrastructure/api/apiClient";
import { callApi } from "@/infrastructure/api/apiResponse";
import { deserialize } from "@/lib/serialize";
import type { Deserializable } from "@/lib/serialize";
import type { School } from "@piano_supporter/common/domains/school.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";
import { ok } from "@piano_supporter/common/lib/error.ts";
import type { createServerSchool } from "@piano_supporter/common/domains/school.ts";
import type { schoolCreateData } from "@piano_supporter/common/commonResponseType/honoRequest.ts";

/**
 * アカウントIDに基づいて学校一覧を取得
 */
export const getSchoolsByAccountId = async (
	accountId: string,
): Promise<Result<School>> => {
	const result = await callApi<School>(() =>
		client["school"].$get({
			query: {
				accountId,
			},
		})
	);
	
	return result;
};

/**
 * 学校IDに基づいて学校を取得（deserialize対応）
 */
export const getSchoolById = async (
	schoolId: string,
): Promise<Result<School>> => {
	const result = await callApi<Deserializable<School>>(() =>
		client["school-init"][":schoolId"].$get({
			param: {
				schoolId,
			},
		})
	);
	if(!result.ok){
		return result;
	}
	const response = result.value;

	// サーバー側でISO文字列として返される日付をDateオブジェクトに変換
	const deserializeResult = deserialize(response);
	if (!deserializeResult.ok) {
		return deserializeResult;
	}

	return ok(deserializeResult.value);
};

/**
 * 新しい学校を作成
 */
export const createSchool = async (
	data: schoolCreateData,
): Promise<Result<createServerSchool>> => {
	const result = await callApi<createServerSchool>(() =>
		client["school-init"].$post({
			json: data,
		})
	);

	return result;
};

/**
 * 共有コードに基づいて学校を取得（deserialize対応）
 */
export const getSchoolByShareCode = async (
	shareCode: string,
): Promise<Result<School>> => {
	const result = await callApi<Deserializable<School>>(() =>
		client["enroll-school"]["share-code"][":shareCode"].$get({
			param: {
				shareCode,
			},
		})
	);

	if (!result.ok) {
		return result;
	}

	const response = result.value;

	// サーバー側でISO文字列として返される日付をDateオブジェクトに変換
	const deserializeResult = deserialize(response);
	if (!deserializeResult.ok) {
		return deserializeResult;
	}

	return ok(deserializeResult.value);
};

/**
 * アカウントを学校に登録
 */
export const enrollAccountToSchool = async (
	accountId: string,
	schoolId: string,
): Promise<Result<{ id: string; accountId: string; schoolId: string }>> => {
	const result = await callApi
	<{ id: string; accountId: string; schoolId: string }>(() =>
		client["enroll-school"].$post({
			json: {
				accountId,
				schoolId,
			},
		})
	);

	return result;
};

/**
 * 学校IDに基づいて共有コードを取得（deserialize対応）
 */
export const getSchoolShareCode = async (
	schoolId: string,
): Promise<Result<string>> => {
	const result = await callApi<Deserializable<School>>(() =>
		client["school-init"][":schoolId"].$get({
			param: {
				schoolId,
			},
		})
	);

	if (!result.ok) {
		return result;
	}

	const response = result.value;
	

	// サーバー側でISO文字列として返される日付をDateオブジェクトに変換
	const deserializeResult = deserialize(response);
	if (!deserializeResult.ok) {
		return deserializeResult;
	}

	// 共有コードを返す
	return ok(deserializeResult.value.shareCode);
};
