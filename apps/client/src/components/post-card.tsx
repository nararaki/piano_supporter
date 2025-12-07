"use client";

import type { Post } from "@piano_supporter/common/domains/post.ts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

/**
 * 日付を相対時間で表示（例: "3時間前"）
 */
const formatRelativeTime = (date: Date): string => {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffSec = Math.floor(diffMs / 1000);
	const diffMin = Math.floor(diffSec / 60);
	const diffHour = Math.floor(diffMin / 60);
	const diffDay = Math.floor(diffHour / 24);

	if (diffSec < 60) {
		return "たった今";
	}
	if (diffMin < 60) {
		return `${diffMin}分前`;
	}
	if (diffHour < 24) {
		return `${diffHour}時間前`;
	}
	if (diffDay < 7) {
		return `${diffDay}日前`;
	}
	return date.toLocaleDateString("ja-JP", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

interface PostCardProps {
	post: Post;
	authorName?: {
		lastName: string;
		firstName: string;
		profileImage?: string | null;
	};
}

export function PostCard({ post, authorName }: PostCardProps) {
	const displayName = authorName
		? `${authorName.lastName} ${authorName.firstName}`
		: "ユーザー";

	const initials = authorName
		? `${authorName.lastName.charAt(0)}${authorName.firstName.charAt(0)}`
		: "U";

	return (
		<Card className="w-full">
			<CardHeader className="pb-3">
				<div className="flex items-center gap-3">
					<Avatar className="h-10 w-10">
						{authorName?.profileImage ? (
							<AvatarImage
								src={authorName.profileImage}
								alt={displayName}
							/>
						) : null}
						<AvatarFallback className="bg-primary text-primary-foreground">
							{initials}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1">
						<p className="font-semibold text-sm">{displayName}</p>
						<p className="text-xs text-muted-foreground">
							{formatRelativeTime(new Date(post.createdAt))}
						</p>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				{post.title && (
					<h3 className="text-lg font-semibold mb-2">{post.title}</h3>
				)}
				{post.content && (
					<p className="text-foreground leading-relaxed whitespace-pre-wrap mb-4">
						{post.content}
					</p>
				)}
				{post.video && (
					<div className="rounded-lg overflow-hidden bg-muted">
						<video
							src={post.video.url}
							controls
							className="w-full max-h-96 object-contain"
							preload="metadata"
						>
							<track kind="captions" />
						</video>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

