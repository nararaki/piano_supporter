import { err, ok, type Result } from "@piano_supporter/common/lib/error";

/**
 * Fetch APIのResponseをResult<T>型に変換する汎用ハンドラ
 * @param res Fetch APIのResponseオブジェクト
 * @template T 成功時のレスポンスボディ（res.json()）の型
 */
export const apiResponseHandler = async <T>(
	res: Response,
): Promise<Result<T>> => {
	if (res.ok) {
		try {
			const result = await res.json();
			return ok(result);
		} catch (e) {
			return err({
				type: "UNEXPECTED",
				message: `レスポンスの解析に失敗しました。${e}`,
			});
		}
	}

	switch (res.status) {
		case 400: {
			const errorBody = await res
				.json()
				.catch(() => ({ message: "不正なリクエストです。" }));
			return err({
				type: "BAD_REQUEST",
				message: errorBody.message || "リクエストが不正です。",
			});
		}

		case 401:
			return err({
				type: "AccountValidaterError",
				message: "ユーザー認証をしてください",
			});

		case 403: // Forbidden
			return err({
				type: "OrgValidaterError",
				message: "教室に所属していません",
			});

		case 404: // Not Found
			return err({
				type: "NOT_FOUND",
				message: "APIエンドポイントが見つかりません",
			});

		case 500: // Internal Server Error
		case 502: // Bad Gateway
		case 503: // Service Unavailable
			return err({
				type: "SERVER_ERROR",
				message: "サーバー側でエラーが発生しました。",
			});

		default: // その他のエラー
			return err({
				type: "UNEXPECTED",
				message: `不明なエラー (Status: ${res.status})`,
			});
	}
};
