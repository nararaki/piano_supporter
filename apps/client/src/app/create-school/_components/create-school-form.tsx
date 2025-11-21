"use client";

import type { SchoolCreateData } from "@piano_supporter/common/commonResponseType/honoResponse.ts";
import type { createServerSchool } from "@piano_supporter/common/domains/index.ts";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showError, showSuccess } from "@/components/ui/toast";
import { createSchool } from "../action/create-school";

interface SchoolCreateFormProps {
	onSchoolCreate: (school: SchoolCreateData) => void;
}

export function SchoolCreateForm({ onSchoolCreate }: SchoolCreateFormProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		location: "",
		email: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const result = await createSchool(formData);
			if (!result.ok) {
				showError("errorが発生しました");
			}

			if (result.ok) {
				const newSchool = result.value as createServerSchool;

				console.log("[v0] Creating school:", newSchool);
				showSuccess(
					"スクールを作成しました",
					`${formData.name}を作成しました。スクールコード: ${newSchool.shareCode}`,
				);
				onSchoolCreate(newSchool);

				setFormData({
					name: "",
					location: "",
					email: "",
				});
			}
		} catch (error) {
			console.error("[v0] Error creating school:", error);
			showError(
				"エラーが発生しました",
				"スクールの作成中にエラーが発生しました。もう一度お試しください。",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="name">
						スクール名 <span className="text-destructive">*</span>
					</Label>
					<Input
						id="name"
						name="name"
						placeholder="例：山田ピアノ教室"
						value={formData.name}
						onChange={handleChange}
						required
						disabled={isLoading}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="location">
						所在地 <span className="text-destructive">*</span>
					</Label>
					<Input
						id="location"
						name="location"
						placeholder="例：東京都渋谷区..."
						value={formData.location}
						onChange={handleChange}
						required
						disabled={isLoading}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="email">メールアドレス</Label>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="example@piano-school.com"
						value={formData.email}
						onChange={handleChange}
						disabled={isLoading}
					/>
				</div>
			</div>

			<div className="rounded-lg border border-muted bg-muted/30 p-4">
				<p className="text-sm text-muted-foreground">
					<span className="font-medium text-foreground">管理者向け機能：</span>
					この機能はピアノの先生や管理者専用です。スクールを作成すると、共有用のスクールコードが自動発行されます。
				</p>
			</div>

			<Button type="submit" className="w-full" disabled={isLoading}>
				{isLoading ? "作成中..." : "スクールを作成する"}
			</Button>
		</form>
	);
}
