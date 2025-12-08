"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { getSchoolId } from "../../action/getSchool";
import { createPractice } from "../action/createPractice";

export const NewPracticeForm = () => {
	const { userId } = useAuth();
	const router = useRouter();
	const [selectedMusicId, setSelectedMusicId] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// TODO: 音楽リストをAPIから取得
	const musicList: Array<{ id: string; title: string; composerName: string }> = [
		// 仮のデータ、後でAPIから取得する
	];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!selectedMusicId) {
			setError("楽曲を選択してください");
			return;
		}

		if (!userId) {
			setError("ユーザー認証が必要です");
			return;
		}
		setIsLoading(true);	
			const schoolId = await getSchoolId(userId);
			if (!schoolId.ok) {
				setError("スクールが見つかりません");
				return;
			}
			const result = await createPractice({ accountId: userId, schoolId: schoolId.value, musicId: selectedMusicId });
			
			if(!result.ok) {
				setError(result.error.message);
				return;
			}	
			router.push("/practicing");
			setIsLoading(false);
			return result.value;
	};

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle>新しい曲を練習</CardTitle>
				<CardDescription>
					練習する楽曲を選択してください
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="music">楽曲を選択</Label>
						<select
							id="music"
							value={selectedMusicId}
							onChange={(e) => setSelectedMusicId(e.target.value)}
							className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
							required
						>
							<option value="">楽曲を選択してください</option>
							{musicList.length === 0 ? (
								<option value="" disabled>
									楽曲が登録されていません
								</option>
							) : (
								musicList.map((music) => (
									<option key={music.id} value={music.id}>
										{music.title} - {music.composerName}
									</option>
								))
							)}
						</select>
					</div>

					{error && (
						<div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
							{error}
						</div>
					)}

					<div className="flex items-center justify-end gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={() => router.back()}
							disabled={isLoading}
						>
							キャンセル
						</Button>
						<Button type="submit" disabled={isLoading || !selectedMusicId}>
							{isLoading ? (
								<>
									<Loader className="mr-2 h-4 w-4" />
									作成中...
								</>
							) : (
								"練習を開始"
							)}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};
