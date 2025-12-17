"use client";

import type { Post } from "@piano_supporter/common/domains/post.ts";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@clerk/nextjs";
import { createComment } from "../action/createComment";

interface CommentModalProps {
	post: Post;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onCommentCreated?: () => void;
}

export function CommentModal({
	post,
	isOpen,
	onOpenChange,
	onCommentCreated,
}: CommentModalProps) {
	const { userId } = useAuth();
	const [commentContent, setCommentContent] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!commentContent.trim() || !userId) return;

		setIsSubmitting(true);

		try {
			const result = await createComment(post.id, userId, commentContent);
			 if (!result.ok) {
			   console.error("コメントの作成に失敗しました", result.error);
			   return;
			 }

			console.log("コメントを作成しました:", {
				postId: post.id,
				accountId: userId,
				content: commentContent.trim(),
			});

			// フォームをリセット
			setCommentContent("");
			onCommentCreated?.();
			onOpenChange(false);
		} catch (error) {
			console.error("コメントの作成に失敗しました", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>コメント</DialogTitle>
				</DialogHeader>

				{/* 投稿内容の表示 */}
				<div className="space-y-4 border-b pb-4">
					{post.title && (
						<h3 className="text-lg font-semibold">{post.title}</h3>
					)}
					{post.content && (
						<p className="text-foreground leading-relaxed whitespace-pre-wrap">
							{post.content}
						</p>
					)}
				</div>

				{/* コメント作成フォーム */}
				<form onSubmit={handleSubmit} className="space-y-4 mt-4">
					<Textarea
						placeholder="コメントを入力..."
						value={commentContent}
						onChange={(e) => setCommentContent(e.target.value)}
						className="min-h-[120px] resize-none"
						maxLength={1000}
					/>

					<div className="flex items-center justify-between">
						<span className="text-sm text-muted-foreground">
							{1000 - commentContent.length}文字
						</span>
						<Button
							type="submit"
							disabled={!commentContent.trim() || isSubmitting}
						>
							{isSubmitting ? "送信中..." : "コメントする"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

