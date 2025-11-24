import { client } from "@/lib/apiClient";
import type { Account } from "@piano_supporter/common/domains/account.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export const getAccount = async (
	userId: string,
): Promise<Result<Account>> => {
	try {
		const rawResult = await (client['account-init'] as any)[userId].$get();
		const response = await rawResult.json();
		if (!rawResult.ok) {
			return response;
		}
		return response;
	} catch (error) {
		if (error instanceof Error && error.message.includes('404')) {
			return {
				ok: false,
				error: {
					type: "NOT_FOUND",
					message: "アカウントが見つかりません",
				},
			};
		}
		return {
			ok: false,
			error: {
				type: "UNEXPECTED",
				message: error instanceof Error ? error.message : "アカウントの取得に失敗しました",
			},
		};
	}
};

