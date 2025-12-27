"use client";
import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createTaskApi } from "@/infrastructure/api/task";
import type { createTaskData } from "@piano_supporter/common/commonResponseType/honoRequest.ts";

interface CreateTaskDialogProps {
	practiceId: string;
	trigger?: React.ReactNode;
}

export const CreateTaskDialog = ({ practiceId, trigger }: CreateTaskDialogProps) => {
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [sectionNumber, setSectionNumber] = useState("");
	const [timePosition, setTimePosition] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleCreateTask = async () => {
		if (!title || !content || !sectionNumber || !timePosition) {
			alert("すべてのフィールドを入力してください");
			return;
		}

		setIsLoading(true);
		const data: createTaskData = {
			title,
			content,
			practiceId,
			sectionNumber: Number(sectionNumber),
			timePosition: Number(timePosition),
		};

		const result = await createTaskApi(data);
		setIsLoading(false);

		if (result.ok) {
			alert("タスクを作成しました");
			setOpen(false);
			setTitle("");
			setContent("");
			setSectionNumber("");
			setTimePosition("");
		} else {
			alert(`タスクの作成に失敗しました: ${result.error.message}`);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{trigger || <Button variant="outline" size="sm">タスクを作成</Button>}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>タスクを作成</DialogTitle>
					<DialogDescription>
						新しいタスクを作成します。すべてのフィールドを入力してください。
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<label htmlFor="title" className="text-sm font-medium">
							タイトル
						</label>
						<Input
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="タスクのタイトルを入力"
						/>
					</div>
					<div className="grid gap-2">
						<label htmlFor="content" className="text-sm font-medium">
							内容
						</label>
						<Input
							id="content"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="タスクの内容を入力"
						/>
					</div>
					<div className="grid gap-2">
						<label htmlFor="sectionNumber" className="text-sm font-medium">
							セクション番号
						</label>
						<Input
							id="sectionNumber"
							type="number"
							value={sectionNumber}
							onChange={(e) => setSectionNumber(e.target.value)}
							placeholder="セクション番号を入力"
							min="1"
						/>
					</div>
					<div className="grid gap-2">
						<label htmlFor="timePosition" className="text-sm font-medium">
							時間位置
						</label>
						<Input
							id="timePosition"
							type="number"
							value={timePosition}
							onChange={(e) => setTimePosition(e.target.value)}
							placeholder="時間位置を入力"
							min="1"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setOpen(false)}
						disabled={isLoading}
					>
						キャンセル
					</Button>
					<Button
						onClick={handleCreateTask}
						disabled={isLoading}
					>
						{isLoading ? "作成中..." : "作成"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

