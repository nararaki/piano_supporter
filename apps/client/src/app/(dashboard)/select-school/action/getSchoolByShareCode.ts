import { client } from "@/lib/apiClient";
import type { School } from "@piano_supporter/common/domains/school.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export const getSchoolByShareCode = async (
	shareCode: string,
): Promise<Result<School>> => {
	try {
		// hono clientのパスパラメータの使い方: client['route-name']['path-segment'][param].$get()
		const rawResult = await client['enroll-school']['share-code'][":shareCode"].$get({
            param: { shareCode: shareCode }
        });
		if (!rawResult.ok) {
			// 404エラーの場合
			if (rawResult.status === 404) {
				return {
					ok: false,
					error: {
						type: "NOT_FOUND",
						message: "スクールが見つかりませんでした",
					},
				};
			}
			return {
				ok: false,
				error: {
					type: "UNEXPECTED",
					message: "スクールの取得に失敗しました",
				},
			};
		}
        const response = await rawResult.json();
		// JSONレスポンスの日付文字列をDateオブジェクトに変換
		const school: School = {
			...response,
			createdAt: new Date(response.createdAt),
			updatedAt: response.updatedAt ? new Date(response.updatedAt) : null,
		};
		return {
			ok: true,
			value: school,
		};
	} catch (error) {
		// 404エラーの場合（アカウントが存在しない）は正常なケースとして扱う
		if (error instanceof Error && error.message.includes('404')) {
			return {
				ok: false,
				error: {
					type: "NOT_FOUND",
					message: "スクールが見つかりませんでした",
				},
			};
		}
		return {
			ok: false,
			error: {
				type: "UNEXPECTED",
				message: error instanceof Error ? error.message : "スクールの取得に失敗しました",
			},
		};
	}
};

