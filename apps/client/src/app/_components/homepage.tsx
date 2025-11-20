"use client";

import {
	Heart,
	Home,
	MessageCircle,
	MoreHorizontal,
	Play,
	Plus,
	Share,
	User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CreatePostModal from "@/components/create-post-modal";
import NavigationMenu from "@/components/navigation-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const HomePage = () => {
	const [userEmail, setUserEmail] = useState("");
	const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
	const [activeTab, setActiveTab] = useState("home");
	const [posts, setPosts] = useState([
		{
			id: 1,
			user: "田中太郎",
			username: "@tanaka_taro",
			content:
				"今日は素晴らしい一日でした！新しいプロジェクトを開始して、チームメンバーと素晴らしいアイデアを共有できました。技術の進歩は本当に驚くべきものですね。",
			likes: 24,
			comments: 8,
			shares: 3,
			time: "2時間前",
			verified: true,
			thread: [
				{
					id: 101,
					user: "佐藤花子",
					username: "@sato_hanako",
					content: "素晴らしいプロジェクトですね！詳細を教えてください。",
					time: "1時間前",
					likes: 5,
				},
				{
					id: 102,
					user: "山田次郎",
					username: "@yamada_jiro",
					content: "私も参加したいです！",
					time: "30分前",
					likes: 3,
				},
			],
		},
		{
			id: 2,
			user: "佐藤花子",
			username: "@sato_hanako",
			content:
				"美味しいランチを作りました！手作りの料理は心も温まりますね。レシピをシェアしたいと思います。",
			likes: 45,
			comments: 12,
			shares: 7,
			time: "4時間前",
			verified: false,
		},
		{
			id: 3,
			user: "山田次郎",
			username: "@yamada_jiro",
			content:
				"週末のハイキングで撮影した動画です。自然の美しさに感動しました！",
			likes: 67,
			comments: 15,
			shares: 12,
			time: "6時間前",
			verified: false,
		},
	]);

	const [myPosts, setMyPosts] = useState([
		{
			id: 100,
			user: userEmail || "あなた",
			username: "@you",
			content: "私の最初の投稿です！よろしくお願いします。",
			likes: 12,
			comments: 4,
			shares: 2,
			time: "1日前",
			verified: false,
			thread: [],
		},
	]);

	const router = useRouter();

	useEffect(() => {
		// Check if user is logged in
		const isLoggedIn = localStorage.getItem("isLoggedIn");
		const email = localStorage.getItem("userEmail");

		if (!isLoggedIn) {
			router.push("/");
			return;
		}

		setUserEmail(email || "");
	}, [router]);

	const handleLogout = () => {
		localStorage.removeItem("isLoggedIn");
		localStorage.removeItem("userEmail");
		router.push("/");
	};

	const toggleLike = (postId: number) => {
		setLikedPosts((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(postId)) {
				newSet.delete(postId);
			} else {
				newSet.add(postId);
			}
			return newSet;
		});
	};

	const handlePostCreated = (newPost: any) => {
		setPosts((prevPosts) => [newPost, ...prevPosts]);
		setMyPosts((prevMyPosts) => [newPost, ...prevMyPosts]);
	};

	const renderThread = (thread: any[]) => {
		if (!thread || thread.length === 0) return null;

		return (
			<div className="ml-8 mt-4 space-y-3 border-l-2 border-muted pl-4">
				{thread.map((comment) => (
					<div key={comment.id} className="flex items-start gap-3">
						<div className="flex-1">
							<div className="flex items-center gap-2">
								<p className="font-medium text-sm">{comment.user}</p>
								<p className="text-xs text-muted-foreground">
									{comment.username}
								</p>
								<p className="text-xs text-muted-foreground">•</p>
								<p className="text-xs text-muted-foreground">{comment.time}</p>
							</div>
							<p className="text-sm text-foreground mt-1">{comment.content}</p>
							<div className="flex items-center gap-4 mt-2">
								<Button
									variant="ghost"
									size="sm"
									className="h-6 px-2 text-xs gap-1"
								>
									<Heart className="h-3 w-3" />
									{comment.likes}
								</Button>
								<Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
									返信
								</Button>
							</div>
						</div>
					</div>
				))}
			</div>
		);
	};

	const renderPosts = (postsToRender: any[]) => (
		<div className="space-y-6">
			{postsToRender.map((post) => (
				<Card
					key={post.id}
					className="shadow-sm hover:shadow-md transition-shadow"
				>
					<CardHeader className="pb-4">
						<div className="flex items-start justify-between">
							<div className="flex items-center gap-3">
								<div>
									<div className="flex items-center gap-2">
										<p className="font-semibold text-foreground">{post.user}</p>
										{post.verified && (
											<div className="h-4 w-4 bg-blue-500 rounded-full flex items-center justify-center">
												<svg
													className="h-2.5 w-2.5 text-white"
													fill="currentColor"
													viewBox="0 0 20 20"
													aria-hidden="true"
												>
													<path
														fillRule="evenodd"
														d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
														clipRule="evenodd"
													/>
												</svg>
											</div>
										)}
									</div>
									<p className="text-sm text-muted-foreground">
										{post.username}
									</p>
									<p className="text-xs text-muted-foreground">{post.time}</p>
								</div>
							</div>
							<Button variant="ghost" size="sm">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</div>
					</CardHeader>

					<CardContent className="space-y-4">
						<p className="text-foreground leading-relaxed">{post.content}</p>

						{/* Video Thumbnail */}
						<div className="relative rounded-xl overflow-hidden bg-muted group cursor-pointer">
							<div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
								<div className="bg-white/90 backdrop-blur-sm rounded-full p-4 group-hover:bg-white transition-colors">
									<Play className="h-6 w-6 text-black ml-1" />
								</div>
							</div>
						</div>

						<Separator />

						{/* Actions */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-6">
								<Button
									variant="ghost"
									size="sm"
									className={`gap-2 hover:text-red-500 transition-colors ${
										likedPosts.has(post.id) ? "text-red-500" : ""
									}`}
									onClick={() => toggleLike(post.id)}
								>
									<Heart
										className={`h-4 w-4 ${likedPosts.has(post.id) ? "fill-current" : ""}`}
									/>
									{post.likes + (likedPosts.has(post.id) ? 1 : 0)}
								</Button>
								<Button
									variant="ghost"
									size="sm"
									className="gap-2 hover:text-blue-500 transition-colors"
								>
									<MessageCircle className="h-4 w-4" />
									{post.comments}
								</Button>
								<Button
									variant="ghost"
									size="sm"
									className="gap-2 hover:text-green-500 transition-colors"
								>
									<Share className="h-4 w-4" />
									{post.shares}
								</Button>
							</div>
						</div>

						{renderThread(post.thread)}
					</CardContent>
				</Card>
			))}
		</div>
	);

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container flex h-16 items-center justify-between px-4">
					<div className="flex items-center gap-6">
						<h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
							SocialApp
						</h1>
						<NavigationMenu userEmail={userEmail} onLogout={handleLogout} />
					</div>
				</div>
			</header>

			<div className="container max-w-2xl mx-auto py-6 px-4">
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid w-full grid-cols-3 mb-6">
						<TabsTrigger value="home" className="gap-2">
							<Home className="h-4 w-4" />
							ホーム
						</TabsTrigger>
						<TabsTrigger value="my-posts" className="gap-2">
							<User className="h-4 w-4" />
							My投稿
						</TabsTrigger>
						<TabsTrigger value="create" className="gap-2">
							<Plus className="h-4 w-4" />
							投稿する
						</TabsTrigger>
					</TabsList>

					<TabsContent value="home" className="space-y-6">
						{renderPosts(posts)}

						{/* Load More */}
						<div className="flex justify-center pt-6">
							<Button variant="outline" className="px-8 bg-transparent">
								さらに読み込む
							</Button>
						</div>
					</TabsContent>

					<TabsContent value="my-posts" className="space-y-6">
						{myPosts.length > 0 ? (
							renderPosts(myPosts)
						) : (
							<Card className="text-center py-12">
								<CardContent>
									<p className="text-muted-foreground mb-4">
										まだ投稿がありません
									</p>
									<Button onClick={() => setActiveTab("create")}>
										最初の投稿を作成
									</Button>
								</CardContent>
							</Card>
						)}
					</TabsContent>

					<TabsContent value="create" className="space-y-6">
						<Card>
							<CardHeader>
								<h2 className="text-xl font-semibold">新しい投稿を作成</h2>
							</CardHeader>
							<CardContent>
								<div className="flex items-center gap-4 mb-6">
									<div className="flex-1">
										<CreatePostModal
											trigger={
												<Button
													variant="outline"
													className="w-full justify-start text-muted-foreground hover:bg-muted/50 h-12 bg-transparent"
												>
													今何をしていますか？
												</Button>
											}
											onPostCreated={handlePostCreated}
										/>
									</div>
								</div>
								<div className="text-center">
									<CreatePostModal
										trigger={
											<Button size="lg" className="gap-2 px-8">
												<Plus className="h-5 w-5" />
												投稿を作成
											</Button>
										}
										onPostCreated={handlePostCreated}
									/>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};
