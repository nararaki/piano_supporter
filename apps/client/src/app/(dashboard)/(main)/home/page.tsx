"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { showError } from "@/components/ui/toast";
import { createAccount } from "@/app/(dashboard)/select-school/action/createAccount";
import { createServerAccount } from "@piano_supporter/common/domains/account.ts";
import { Result } from "@piano_supporter/common/lib/error.ts";

export default function HomePage() {
	const router = useRouter();
	const { isLoaded, isSignedIn } = useAuth();
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
				user.lastName &&
				user.firstName &&
				user.emailAddresses &&
				user.emailAddresses.length > 0
			) {
				accountCreatedRef.current = true;

				const result: Result<createServerAccount> = await createAccount(
					user.id,
					user.lastName,
					user.firstName,
					user.emailAddresses[0].emailAddress,
				);

				if (!result.ok) {
					showError("アカウント登録に失敗しました");
					console.error("Account creation failed:", result.error);
					return;
				}

				console.log("Account created successfully:", result.value);
			}
		};

		handleAccountCreation();
	}, [isLoaded, isUserLoaded, isSignedIn, user]);

	return (
		<div className="container mx-auto px-4 py-6 pb-24">
			<h1 className="text-2xl font-bold mb-4">Home</h1>
			<p className="text-muted-foreground">ホームページのコンテンツ</p>
		</div>
	);
}


