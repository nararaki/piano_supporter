"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { showError } from "@/components/ui/toast";
import { createAccount } from "@/app/(dashboard)/(main)/home/action/createAccount";
import { getAccount } from "@/app/(dashboard)/(main)/home/action/getAccount";
import { createServerAccount } from "@piano_supporter/common/domains/account.ts";
import { Result } from "@piano_supporter/common/lib/error.ts";

export default function HomePage() {
	const router = useRouter();
	const { isLoaded, isSignedIn, userId } = useAuth();
	const { isLoaded: isUserLoaded, user } = useUser();
	const accountCreatedRef = useRef(false);

	useEffect(() => {
		const handleAccountCreation = async () => {
			// 既にアカウント作成済みの場合はスキップ
			if (accountCreatedRef.current) {
				return;
			}

			// 認証とユーザー情報が読み込まれ、サインイン済みの場合
			if (
				isLoaded &&
				isUserLoaded &&
				isSignedIn &&
				user &&
				userId &&
				user.lastName &&
				user.firstName &&
				user.emailAddresses &&
				user.emailAddresses.length > 0
			) {
				try {
					// まずアカウントが既に存在するかチェック
					const accountResult = await getAccount(userId);
					if (accountResult.ok) {
						// アカウントが存在する場合は即座にtrueにする
						accountCreatedRef.current = true;
						console.log("Account already exists:", accountResult.value);
						return;
					}

					// アカウントが存在しない場合は作成
					accountCreatedRef.current = true;

					const result: Result<createServerAccount> = await createAccount(
						user.id,
						user.lastName,
						user.firstName,
						user.emailAddresses[0].emailAddress,
					);

					if (!result.ok) {
						const errorMessage = result.error?.message || "エラーが発生しました";
						showError("アカウント登録に失敗しました", errorMessage);
						console.error("Account creation failed:", result.error);
						// エラー時はfalseに戻す（次回再試行できるように）
						accountCreatedRef.current = false;
						return;
					}
					console.log("Account created successfully:", result.value);
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : "予期しないエラーが発生しました";
					showError("アカウント登録に失敗しました", errorMessage);
					console.error("Unexpected error during account creation:", error);
					// エラー時はfalseに戻す（次回再試行できるように）
					accountCreatedRef.current = false;
				}
			}
		};

		handleAccountCreation();
	}, [isLoaded, isUserLoaded, isSignedIn, user, userId]);

	return (
		<div className="container mx-auto px-4 py-6 pb-24">
			<h1 className="text-2xl font-bold mb-4">Home</h1>
			<p className="text-muted-foreground">ホームページのコンテンツ</p>
		</div>
	);
}


