"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { showError, showSuccess } from "@/components/ui/toast";
import { Loader2 } from "lucide-react";
import { createPost } from "./action/createPost";

export default function NewPostPage() {
	const router = useRouter();
	const { userId } = useAuth();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!userId) {
			showError("エラー", "ユーザー情報が取得できませんでした");
			return;
		}

		if (!title.trim()) {
			showError("エラー", "タイトルを入力してください");
			return;
		}

		if (!content.trim()) {
			showError("エラー", "内容を入力してください");
			return;
		}

		setIsLoading(true);

		try {
			const result = await createPost({
				accountId: userId,
				title: title.trim(),
				content: content.trim(),
			});

			if (!result.ok) {
				showError("投稿の作成に失敗しました", result.error.message || "エラーが発生しました");
				return;
			}

			showSuccess("投稿を作成しました", "投稿が正常に作成されました");
			
			// フォームをリセット
			setTitle("");
			setContent("");

			// ホームページに遷移
			router.push("/home");
		} catch (error) {
			console.error("Unexpected error creating post:", error);
			showError("エラー", "投稿の作成中にエラーが発生しました");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container mx-auto px-4 py-6 pb-24 max-w-2xl">
			<h1 className="text-2xl font-bold mb-4">投稿する</h1>
			
			<Card>
				<CardHeader>
					<CardTitle>新しい投稿を作成</CardTitle>
					<CardDescription>
						スクールのメンバーに共有したい内容を投稿できます
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="title">
								タイトル <span className="text-destructive">*</span>
							</Label>
							<Input
								id="title"
								placeholder="投稿のタイトルを入力"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
								disabled={isLoading}
								maxLength={255}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="content">
								内容 <span className="text-destructive">*</span>
							</Label>
							<Textarea
								id="content"
								placeholder="投稿の内容を入力"
								value={content}
								onChange={(e) => setContent(e.target.value)}
								required
								disabled={isLoading}
								className="min-h-[200px]"
							/>
						</div>

						<div className="flex gap-2 justify-end">
							<Button
								type="button"
								variant="outline"
								onClick={() => router.push("/home")}
								disabled={isLoading}
							>
								キャンセル
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										投稿中...
									</>
								) : (
									"投稿する"
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
