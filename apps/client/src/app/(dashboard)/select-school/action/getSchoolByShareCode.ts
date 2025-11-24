import { client } from "@/lib/apiClient.ts";
import { deserialize } from "@/lib/serialize.ts";
import type { School } from "@piano_supporter/common/domains/school.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";
import { ok } from "@piano_supporter/common/lib/error.ts";
import type { Deserializable } from "@/lib/serialize.ts";

export const getSchoolByShareCode = async (
	shareCode: string,
): Promise<Result<School>> => {
	try {
		const rawResult = await client['enroll-school']['share-code'][":shareCode"].$get({
            param: { shareCode: shareCode }
        });
		const response = await rawResult.json() as Result<Deserializable<School>>;
		
		if (!response.ok) {
			return response as Result<School>;
		}
		
		// サーバー側でISO文字列として返される日付をDateオブジェクトに変換
		const parsseResult = deserialize(response.value);
		if(!parsseResult.ok){
			return parsseResult;
		}
		return ok(parsseResult.value);
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

