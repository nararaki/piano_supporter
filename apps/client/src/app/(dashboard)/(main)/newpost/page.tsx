"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Loader2, Video, X, Upload } from "lucide-react";
import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import {
	ALLOWED_VIDEO_TYPES,
	MAX_VIDEO_SIZE,
} from "@piano_supporter/common/constants/upload.ts";
import { createPost } from "./action/createPost";

export default function NewPostPage() {
	const router = useRouter();
	const { userId } = useAuth();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);
	const videoInputRef = useRef<HTMLInputElement>(null);

	const validateVideoFile = (file: File): Result<void> => {
		if (file.size > MAX_VIDEO_SIZE) {
			return err({
				type: "BAD_REQUEST",
				message: "ファイルサイズは500MB以下にしてください",
			});
		}

		if (!ALLOWED_VIDEO_TYPES.includes(file.type as typeof ALLOWED_VIDEO_TYPES[number])) {
			return err({
				type: "BAD_REQUEST",
				message: "サポートされていない動画形式です。MP4、WebM、MOV、AVI形式をサポートしています",
			});
		}

		return ok(undefined);
	};

	const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const result = validateVideoFile(file);
		if (!result.ok) {
			showError("ファイルエラー", result.error.message);
			return;
		}

		setSelectedVideo(file);
		const url = URL.createObjectURL(file);
		setPreviewUrl(url);
	};

	const removeVideo = () => {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}
		setSelectedVideo(null);
		setPreviewUrl(null);
		if (videoInputRef.current) {
			videoInputRef.current.value = "";
		}
	};

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
			// ビデオファイルを含めて投稿を作成（S3アップロードも含む）
			if (selectedVideo) {
				setIsUploading(true);
				setUploadProgress(0);
			}

			const result = await createPost(
				{
					accountId: userId,
					title: title.trim(),
					content: content.trim(),
					videoFile: selectedVideo || undefined,
				},
				(progress) => {
					setUploadProgress(progress);
				},
			);

			setIsUploading(false);

			if (!result.ok) {
				showError("投稿の作成に失敗しました", result.error.message || "エラーが発生しました");
				return;
			}

			showSuccess("投稿を作成しました", "投稿が正常に作成されました");
			
			// フォームをリセット
			setTitle("");
			setContent("");
			removeVideo();

			// ホームページに遷移
			router.push("/home");
		} catch (error) {
			console.error("Unexpected error creating post:", error);
			showError("エラー", "投稿の作成中にエラーが発生しました");
		} finally {
			setIsLoading(false);
			setIsUploading(false);
			setUploadProgress(0);
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

						<div className="space-y-2">
							<Label htmlFor="video">動画</Label>
							{isUploading && (
								<div className="space-y-2">
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<Upload className="h-4 w-4" />
										アップロード中... {uploadProgress}%
									</div>
									<Progress value={uploadProgress} className="h-2" />
								</div>
							)}
							{!selectedVideo ? (
								<div className="flex items-center gap-2">
									<Label htmlFor="video-upload" className="cursor-pointer">
										<Button
											type="button"
											variant="outline"
											className="gap-2"
											disabled={isLoading}
											asChild
										>
											<span>
												<Video className="h-4 w-4" />
												動画を選択
											</span>
										</Button>
									</Label>
									<Input
										ref={videoInputRef}
										id="video-upload"
										type="file"
										accept="video/*"
										onChange={handleVideoSelect}
										className="hidden"
										disabled={isLoading}
									/>
									<p className="text-sm text-muted-foreground">
										最大500MB、MP4、WebM、MOV、AVI形式をサポート
									</p>
								</div>
							) : (
								<div className="space-y-2">
									<div className="relative rounded-lg overflow-hidden border bg-muted">
										{previewUrl && (
											// biome-ignore lint/a11y/useMediaCaption: <explanation>
											<video
												src={previewUrl}
												controls
												className="w-full max-h-[400px]"
											/>
										)}
										<div className="absolute top-2 right-2">
											<Button
												type="button"
												variant="destructive"
												size="icon"
												onClick={removeVideo}
												disabled={isLoading}
												className="h-8 w-8"
											>
												<X className="h-4 w-4" />
											</Button>
										</div>
									</div>
									<div className="text-sm text-muted-foreground">
										<p>ファイル名: {selectedVideo.name}</p>
										<p>サイズ: {(selectedVideo.size / (1024 * 1024)).toFixed(2)} MB</p>
									</div>
								</div>
							)}
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
