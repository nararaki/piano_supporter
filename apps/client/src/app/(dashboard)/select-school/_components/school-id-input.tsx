"use client";

import type { School } from "@piano_supporter/common/domains/school.ts";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSchoolByShareCode } from "../action/getSchoolByShareCode";

interface SchoolIdInputProps {
	onSchoolSelect: (school: School) => void;
}

export function SchoolIdInput({ onSchoolSelect }: SchoolIdInputProps) {
	const [shareCode, setShareCode] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [foundSchool, setFoundSchool] = useState<School | null>(null);

	const handleFetchSchool = async () => {
		if (!shareCode.trim()) {
			setError("共有コードを入力してください");
			return;
		}

		setIsLoading(true);
		setError(null);
		setFoundSchool(null);

		try {
			const result = await getSchoolByShareCode(shareCode);
			if (!result.ok) {
				setError(result.error.message || "スクールの取得に失敗しました");
				return;
			}

			setFoundSchool(result.value);
		} catch (err) {
			setError(err instanceof Error ? err.message : "エラーが発生しました");
		} finally {
			setIsLoading(false);
		}
	};

	const handleConfirm = () => {
		if (foundSchool) {
			onSchoolSelect(foundSchool);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex gap-2">
				<Input
					type="text"
					placeholder="共有コードを入力"
					value={shareCode}
					onChange={(e) => {
						setShareCode(e.target.value);
						setError(null);
						setFoundSchool(null);
					}}
					onKeyDown={(e) => e.key === "Enter" && handleFetchSchool()}
				/>
				<Button onClick={handleFetchSchool} disabled={isLoading}>
					{isLoading ? "確認中..." : "確認"}
				</Button>
			</div>

			{error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{foundSchool && (
				<Card className="p-4">
					<div className="mb-3 flex items-start gap-2">
						<CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
						<div className="flex-1">
							<h3 className="font-semibold">{foundSchool.name}</h3>
							<p className="text-sm text-muted-foreground">
								{foundSchool.location}
							</p>
							<p className="mt-1 text-xs text-muted-foreground">
								ID: {foundSchool.id}
							</p>
						</div>
					</div>
					<Button onClick={handleConfirm} className="w-full">
						このスクールを選択
					</Button>
				</Card>
			)}
		</div>
	);
}

