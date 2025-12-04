import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";

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
		//todo: Api側で返すエラーのレスポンス番号を定義しておく
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

/**
 * Hono ClientのAPI呼び出しをラップし、ネットワークエラーとステータスコードに対応した汎用関数
 * @param apiCall Hono Clientのメソッド呼び出し（Promise<Response>を返す関数）
 * @template T 成功時のレスポンスボディの型
 * @returns Result<T>型のレスポンス
 */
export const callApi = async <T>(
	apiCall: () => Promise<Response>,
): Promise<Result<T>> => {
	try {
		const response = await apiCall();
		return await apiResponseHandler<T>(response);
	} catch (error) {
		// ネットワークエラー（接続エラー、タイムアウトなど）
		if (error instanceof TypeError && error.message.includes("fetch")) {
			return err({
				type: "UNEXPECTED",
				message: "ネットワークエラーが発生しました。インターネット接続を確認してください。",
			});
		}

		// その他の予期しないエラー
		return err({
			type: "UNEXPECTED",
			message:
				error instanceof Error
					? `API呼び出しに失敗しました: ${error.message}`
					: "API呼び出しに失敗しました",
		});
	}
};
