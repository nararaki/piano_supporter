"use client";

import { useState, useEffect } from "react";
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
import { getComposers } from "../action/getComposers";
import { getMusics } from "../action/getMusics";
import type { Composer } from "@piano_supporter/common/domains/composer.ts";
import type { Music } from "@piano_supporter/common/domains/music.ts";

export const NewPracticeForm = () => {
	const { userId } = useAuth();
	const router = useRouter();
	const [selectedComposerName, setSelectedComposerName] = useState<string>("");
	const [selectedMusicTitle, setSelectedMusicTitle] = useState<string>("");
	const [composers, setComposers] = useState<Composer[]>([]);
	const [musics, setMusics] = useState<Music[]>([]);
	const [isLoadingComposers, setIsLoadingComposers] = useState(false);
	const [isLoadingMusics, setIsLoadingMusics] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	// 作曲家一覧を取得
	useEffect(() => {
		const fetchComposers = async () => {
			setIsLoadingComposers(true);	
			const result = await getComposers();
			console.log("result", result);
			if (result.ok) {
				setComposers(result.value);
			}
			setIsLoadingComposers(false);
		};
		fetchComposers();
	}, []);

	// 作曲家が選択されたら楽曲一覧を取得
	useEffect(() => {
		if (!selectedComposerName) {
			setMusics([]);
			setSelectedMusicTitle("");
			return;
		}

		const fetchMusics = async () => {
			setIsLoadingMusics(true);
			const result = await getMusics(selectedComposerName);
			if (result.ok) {
				setMusics(result.value);
			}
			setIsLoadingMusics(false);
		};
		fetchMusics();
		console.log("コンポーザーが選択されたよ")
	}, [selectedComposerName]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!selectedComposerName) {
			setError("作曲家を選択してください");
			return;
		}

		if (!selectedMusicTitle) {
			setError("楽曲を選択してください");
			return;
		}

		if (!userId) {
			setError("ユーザー認証が必要です");
			return;
		}

		setIsLoading(true);
		try {
			const schoolResult = await getSchoolId(userId);
			console.log("schoolResult", schoolResult);
			if (!schoolResult.ok) {
				setError("スクールが見つかりません");
				setIsLoading(false);
				return;
			}

			const schoolId = schoolResult.value.id;
			const result = await createPractice({
				accountId: userId,
				schoolId: schoolId,
				musicId: selectedMusicTitle,
			});

			if (!result.ok) {
				setError(result.error.message);
				setIsLoading(false);
				return;
			}

			router.push("/practicing");
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "練習の作成に失敗しました"
			);
			setIsLoading(false);
		}
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
						<Label htmlFor="composer">作曲家を選択</Label>
						<select
							id="composer"
							value={selectedComposerName}
							onChange={(e) => {
								setSelectedComposerName(e.target.value);
								setSelectedMusicTitle("");
							}}
							className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
							required
							disabled={isLoadingComposers}
						>
							<option value="">作曲家を選択してください</option>
							{isLoadingComposers ? (
								<option value="" disabled>
									読み込み中...
								</option>
							) : composers.length === 0 ? (
								<option value="" disabled>
									作曲家が登録されていません
								</option>
							) : (
								composers.map((composer) => (
									<option key={composer.name} value={composer.name}>
										{composer.name}
									</option>
								))
							)}	
						</select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="music">楽曲を選択</Label>
						<select
							id="music"
							value={selectedMusicTitle}
							onChange={(e) => setSelectedMusicTitle(e.target.value)}
							className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
							required
							disabled={!selectedComposerName || isLoadingMusics}
						>
							<option value="">
								{!selectedComposerName
									? "まず作曲家を選択してください"
									: isLoadingMusics
									? "読み込み中..."
									: "楽曲を選択してください"}
							</option>
							{musics.length === 0 && selectedComposerName && !isLoadingMusics ? (
								<option value="" disabled>
									楽曲が登録されていません
								</option>
							) : (
								musics.map((music) => (
									<option key={music.title} value={music.title}>
										{music.title}
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
						<Button
							type="submit"
							disabled={isLoading || !selectedComposerName || !selectedMusicTitle}
						>
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
