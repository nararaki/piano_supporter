"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { showSuccess } from "@/components/ui/toast";

interface ShareCodeDisplayProps {
	shareCode: string;
}

export function ShareCodeDisplay({ shareCode }: ShareCodeDisplayProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(shareCode);
			setCopied(true);
			showSuccess("コピーしました", "共有コードをクリップボードにコピーしました");
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error("コピーに失敗しました:", error);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>共有コード</CardTitle>
				<CardDescription>
					このコードを他のユーザーに共有することで、スクールへの参加を許可できます
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex items-center gap-2">
					<div className="flex-1 rounded-md border bg-muted px-4 py-3 font-mono text-lg font-semibold">
						{shareCode}
					</div>
					<Button
						onClick={handleCopy}
						variant={copied ? "default" : "outline"}
						size="lg"
						className="shrink-0"
					>
						{copied ? (
							<>
								<Check className="mr-2 h-4 w-4" />
								コピー済み
							</>
						) : (
							<>
								<Copy className="mr-2 h-4 w-4" />
								コピー
							</>
						)}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

