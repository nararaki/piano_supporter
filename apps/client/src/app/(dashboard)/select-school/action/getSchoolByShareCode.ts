import { client } from "@/lib/apiClient";
import type { School } from "@piano_supporter/common/domains/school.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";
import { ok } from "@piano_supporter/common/lib/error.ts";

export const getSchoolByShareCode = async (
	shareCode: string,
): Promise<Result<School>> => {
	try {
		const rawResult = await client['enroll-school']['share-code'][":shareCode"].$get({
            param: { shareCode: shareCode }
        });
		const response = await rawResult.json() as Result<{
			id: string;
			name: string;
			email: string;
			location: string;
			shareCode: string;
			createdAt: string;
			updatedAt: string | null;
		}>;
		
		if (!response.ok) {
			return response as Result<School>;
		}
		
		// サーバー側でISO文字列として返される日付をDateオブジェクトに変換
		const school: School = {
			...response.value,
			createdAt: new Date(response.value.createdAt),
			updatedAt: response.value.updatedAt ? new Date(response.value.updatedAt) : null,
		};
		
		return ok(school);
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

