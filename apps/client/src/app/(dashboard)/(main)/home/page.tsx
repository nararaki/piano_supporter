"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { showError } from "@/components/ui/toast";
import { createAccount } from "@/app/(dashboard)/(main)/home/action/createAccount";
import { getAccount } from "@/app/(dashboard)/(main)/home/action/getAccount";
import { getPosts } from "@/app/(dashboard)/(main)/home/action/getPosts";
import type { createServerAccount, Account } from "@piano_supporter/common/domains/account.ts";
import type { Post } from "@piano_supporter/common/domains/post.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";
import { Loader2 } from "lucide-react";
import { PostCard } from "@/app/(dashboard)/(main)/home/_components/post-card";

export default function HomePage() {
	const { isLoaded, isSignedIn, userId } = useAuth();
	const { isLoaded: isUserLoaded, user } = useUser();
	const accountCreatedRef = useRef(false);
	const [posts, setPosts] = useState<Post[]>([]);
	const [isLoadingPosts, setIsLoadingPosts] = useState(false);
	const [accountMap, setAccountMap] = useState<Map<string, Account>>(new Map());

	const fetchPosts = useCallback(async (accountId: string) => {
		setIsLoadingPosts(true);
		try {
			const result = await getPosts(accountId);
			if (!result.ok) {
				// school登録されていない場合はエラーを表示しない（正常な状態）
				if (result.error.type !== "CANNOT_FIND_SCHOOL") {
					console.error("Failed to fetch posts:", result.error);
				}
				return;
			}
			setPosts(result.value);

			// 各投稿のアカウント情報を取得
			const uniqueAccountIds = [...new Set(result.value.map((post) => post.accountId))];
			const accountResults = await Promise.all(
				uniqueAccountIds.map(async (id) => {
					const accountResult = await getAccount(id);
					return accountResult.ok ? { id, account: accountResult.value } : null;
				}),
			);

			const newAccountMap = new Map<string, Account>();
			accountResults.forEach((result) => {
				if (result) {
					newAccountMap.set(result.id, result.account);
				}
			});
			setAccountMap(newAccountMap);
		} catch (error) {
			console.error("Unexpected error fetching posts:", error);
			showError("投稿の読み込みに失敗しました", error instanceof Error ? error.message : "予期しないエラーが発生しました");
		} finally {
			setIsLoadingPosts(false);
		}
	}, []);

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
						// アカウントが存在する場合、投稿を取得
						await fetchPosts(userId);
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
					// アカウント作成後、投稿を取得
					await fetchPosts(userId);
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
	}, [isLoaded, isUserLoaded, isSignedIn, user, userId, fetchPosts]);

	return (
		<div className="container mx-auto px-4 py-6 pb-24">
			<h1 className="text-2xl font-bold mb-4">Home</h1>
			
			{isLoadingPosts && (
				<div className="flex items-center justify-center py-8">
					<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
					<span className="ml-2 text-muted-foreground">投稿を読み込み中...</span>
				</div>
			)}

			{!isLoadingPosts && posts.length === 0 && (
				<p className="text-muted-foreground">
					スクールに登録されていないか、投稿がありません。
				</p>
			)}

			{!isLoadingPosts && posts.length > 0 && (
				<div className="space-y-4">
					{posts.map((post) => {
						const account = accountMap.get(post.accountId);
						return (
							<PostCard
								key={post.id}
								post={post}
								authorName={
									account
										? {
												lastName: account.lastName,
												firstName: account.firstName,
												profileImage: account.profileImage,
											}
										: undefined
								}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}


