"use client";

import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
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

export default function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate login process
		await new Promise((resolve) => setTimeout(resolve, 1000));

		console.log("Login successful:", { email });

		// Store user session (in a real app, this would be handled by auth service)
		localStorage.setItem("isLoggedIn", "true");
		localStorage.setItem("userEmail", email);

		// Redirect to home page
		router.push("/home");

		setIsLoading(false);
	};

	return (
		<Card className="w-full">
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl font-bold text-center">
					ログイン
				</CardTitle>
				<CardDescription className="text-center">
					メールアドレスとパスワードを入力してください
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">メールアドレス</Label>
						<div className="relative">
							<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<Input
								id="email"
								type="email"
								placeholder="example@email.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="pl-10"
								required
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">パスワード</Label>
						<div className="relative">
							<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="パスワードを入力"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="pl-10 pr-10"
								required
							/>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? (
									<EyeOff className="h-4 w-4 text-muted-foreground" />
								) : (
									<Eye className="h-4 w-4 text-muted-foreground" />
								)}
							</Button>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<input
								id="remember"
								type="checkbox"
								className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
							/>
							<Label htmlFor="remember" className="text-sm">
								ログイン状態を保持
							</Label>
						</div>
						<Button variant="link" className="px-0 text-sm">
							パスワードを忘れた方
						</Button>
					</div>

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? "ログイン中..." : "ログイン"}
					</Button>

					<div className="text-center text-sm text-muted-foreground">
						アカウントをお持ちでない方は{" "}
						<Button variant="link" className="px-0 text-sm">
							新規登録
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
