"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import type { School } from "@piano_supporter/common/domains/school.ts";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showError, showSuccess } from "@/components/ui/toast";
import { SchoolIdInput } from "./_components/school-id-input";
import { SchoolSearch } from "./_components/school-search";
import { enrollSchool } from "./action/enrollSchool";

export default function SelectSchoolPage() {
	const router = useRouter();
	const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
	const { isLoaded, userId, sessionId } = useAuth();
	const { isLoaded: isUserLoaded, isSignedIn, user } = useUser();

	// アカウントIDはuserIdを使用（homeで既にアカウントが作成されている）
	const accountId = userId;

	const handleSchoolSelect = async (school: School) => {
		try {
			setSelectedSchool(school);

			console.log("[v0] Selected school:", school);

			// アカウントIDが取得できていない場合はエラー
			if (!accountId) {
				showError("アカウント情報が取得できませんでした");
				return;
			}

			// アカウントとスクールを連携
			const enrollResult = await enrollSchool(accountId, school.id);
			if (!enrollResult.ok) {
				showError(
					"スクールへの登録に失敗しました",
					enrollResult.error.message || "エラーが発生しました",
				);
				return;
			}

			showSuccess("スクールを選択しました", `${school.name}を選択しました`);

			// 登録成功後、/homeに遷移
			router.push("/home");
		} catch (error) {
			console.error("[v0] Error selecting school:", error);
			showError(
				"エラーが発生しました",
				"スクールの選択中にエラーが発生しました。もう一度お試しください。",
			);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
			<Card className="w-full max-w-2xl">
				<CardHeader>
					<CardTitle className="text-2xl">スクールを選択</CardTitle>
					<CardDescription>
						通われるピアノ教室を検索するか、共有コードを入力してください
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="search" className="w-full">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="search">スクール検索</TabsTrigger>
							<TabsTrigger value="id">共有コード入力</TabsTrigger>
						</TabsList>
						<TabsContent value="search" className="mt-6">
							<SchoolSearch onSchoolSelect={handleSchoolSelect} />
						</TabsContent>
						<TabsContent value="id" className="mt-6">
							<SchoolIdInput onSchoolSelect={handleSchoolSelect} />
						</TabsContent>
					</Tabs>

					<div className="mt-6 flex items-center justify-center border-t pt-6">
						<Button
							variant="outline"
							onClick={() => router.push("/school/create")}
							className="w-full sm:w-auto"
						>
							<Plus className="mr-2 h-4 w-4" />
							スクールを開設する
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

