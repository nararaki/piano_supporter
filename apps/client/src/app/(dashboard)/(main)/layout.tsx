"use client";

import { Home, User, Music, CheckSquare, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	const navigationItems = [
		{ icon: Home, label: "Home", href: "/home" },
		{ icon: User, label: "My投稿", href: "/mypage" },
		{ icon: Music, label: "練習中曲一覧", href: "/practicing" },
		{ icon: CheckSquare, label: "task", href: "/tasks" },
		{ icon: Plus, label: "投稿する", href: "/newpost" },
	];

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1">{children}</main>
			<nav className="fixed bottom-0 left-0 right-0 border-t bg-background z-50">
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-around h-16">
						{navigationItems.map((item) => {
							const Icon = item.icon;
							const isActive = pathname === item.href;
							return (
								<Link key={item.href} href={item.href}>
									<Button
										variant={isActive ? "default" : "ghost"}
										size="sm"
										className="flex flex-col items-center gap-1 h-auto py-2"
									>
										<Icon className="h-5 w-5" />
										<span className="text-xs">{item.label}</span>
									</Button>
								</Link>
							);
						})}
					</div>
				</div>
			</nav>
		</div>
	);
}

