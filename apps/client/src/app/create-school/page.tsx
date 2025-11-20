"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { SchoolCreateForm } from "./_components/create-school-form";

export default function CreateSchoolPage() {
	const router = useRouter();

	const handleSchoolCreate = () => {
		// スクール作成後はschoolのdashboardページへ戻る
		// TODO: 作成したスクールを自動選択する処理を追加
		router.push("/");
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
			<Card className="w-full max-w-2xl">
				<CardHeader>
					<div className="mb-4">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => router.push("/select-school")}
							className="gap-2"
						>
							<ArrowLeft className="h-4 w-4" />
							スクール選択に戻る
						</Button>
					</div>
					<CardTitle className="text-2xl">スクールを開設する</CardTitle>
					<CardDescription>
						新しいピアノ教室を登録します。この機能は教室の先生や管理者専用です。
					</CardDescription>
				</CardHeader>
				<CardContent>
					<SchoolCreateForm onSchoolCreate={handleSchoolCreate} />
				</CardContent>
			</Card>
		</div>
	);
}
