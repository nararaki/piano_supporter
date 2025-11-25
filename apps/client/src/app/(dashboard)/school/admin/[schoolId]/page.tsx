"use client";

import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { showError } from "@/components/ui/toast";
import { AlertCircle, Loader2 } from "lucide-react";
import { getSchoolShareCode } from "../action/getSchoolShareCode";
import { ShareCodeDisplay } from "../_components/share-code-display";

export default function AdminSchoolPage() {
	const params = useParams();
	const { userId } = useAuth();
	const [shareCode, setShareCode] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchShareCode = async () => {
			// パスパラメータからschoolIdを取得
			const schoolId = params.schoolId as string;
			
			if (!schoolId) {
				setError("schoolIdが指定されていません");
				setIsLoading(false);
				return;
			}

			setIsLoading(true);
			setError(null);

			try {
				const result = await getSchoolShareCode(schoolId);
				if (!result.ok) {
					setError(result.error.message || "共有コードの取得に失敗しました");
					showError("エラー", result.error.message || "共有コードの取得に失敗しました");
					return;
				}

				setShareCode(result.value);
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : "エラーが発生しました";
				setError(errorMessage);
				showError("エラー", errorMessage);
			} finally {
				setIsLoading(false);
			}
		};

		fetchShareCode();
	}, [params]);

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
			<Card className="w-full max-w-2xl">
				<CardHeader>
					<CardTitle className="text-2xl">スクール管理</CardTitle>
					<CardDescription>
						スクールの詳細情報を確認・管理できます
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading && (
						<div className="flex items-center justify-center py-8">
							<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
							<span className="ml-2 text-muted-foreground">読み込み中...</span>
						</div>
					)}

					{error && (
						<Alert variant="destructive" className="mb-4">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{shareCode && !isLoading && !error && (
						<ShareCodeDisplay shareCode={shareCode} />
					)}
				</CardContent>
			</Card>
		</div>
	);
}

