"use client";

import {
	Home,
	User,
	Music,
	CheckSquare,
	Plus,
	School,
	Link as LinkIcon,
	Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const [isSheetOpen, setIsSheetOpen] = useState(false);

	const navigationItems = [
		{ icon: Home, label: "Home", href: "/home" },
		{ icon: User, label: "My投稿", href: "/mypage" },
		{ icon: Music, label: "練習中曲一覧", href: "/practicing" },
		{ icon: CheckSquare, label: "task", href: "/tasks" },
		{ icon: Plus, label: "投稿する", href: "/newpost" },
		{ icon: School, label: "スクールを作成", href: "/school/create" },
		{ icon: LinkIcon, label: "スクール連携", href: "/school/select" },
	];

	return (
		<div className="min-h-screen flex flex-col">
			<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container flex h-16 items-center justify-between px-4">
					<div className="flex items-center gap-4">
						<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon">
									<Menu className="h-5 w-5" />
								</Button>
							</SheetTrigger>
							<SheetContent side="left" className="w-80">
								<SheetHeader>
									<SheetTitle className="text-left">メニュー</SheetTitle>
								</SheetHeader>
								<div className="mt-6 space-y-2">
									{navigationItems.map((item) => {
										const Icon = item.icon;
										const isActive = pathname === item.href;
										return (
											<Link key={item.href} href={item.href}>
												<Button
													variant={isActive ? "default" : "ghost"}
													className="w-full justify-start gap-3 h-12"
													onClick={() => setIsSheetOpen(false)}
												>
													<Icon className="h-5 w-5" />
													{item.label}
												</Button>
											</Link>
										);
									})}
								</div>
							</SheetContent>
						</Sheet>
						<h1 className="text-xl font-bold">Piano Support</h1>
					</div>
				</div>
			</header>
			<main className="flex-1">{children}</main>
		</div>
	);
}

