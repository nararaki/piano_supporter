import { client } from "@/lib/apiClient.ts";
import { deserialize } from "@/lib/serialize.ts";
import type { School } from "@piano_supporter/common/domains/school.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";
import { ok } from "@piano_supporter/common/lib/error.ts";
import type { Deserializable } from "@/lib/serialize.ts";

export const getSchoolShareCode = async (
	schoolId: string,
): Promise<Result<string>> => {
	try {
		const rawResult = await client['school-init'][":schoolId"].$get({
			param: { schoolId: schoolId }
		});
		const response = await rawResult.json() as Result<Deserializable<School>>;
		
		if (!response.ok) {
			return {
				ok: false,
				error: response.error,
			};
		}
		
		// サーバー側でISO文字列として返される日付をDateオブジェクトに変換
		const parseResult = deserialize(response.value);
		if(!parseResult.ok){
			return parseResult;
		}
		
		// 共有コードを返す
		return ok(parseResult.value.shareCode);
	} catch (error) {
		return {
			ok: false,
			error: {
				type: "UNEXPECTED",
				message: error instanceof Error ? error.message : "スクールの取得に失敗しました",
			},
		};
	}
};

