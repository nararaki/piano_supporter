"use client";
import { useState, useEffect } from "react";
import { getTasks } from "../_action/getTasks";
import TaskComponent from "./task";
import type { Task } from "@piano_supporter/common/domains/task.ts";
import { showError } from "@/components/ui/toast";

export default function TasksViewer({ practiceId }: { practiceId: string }) {
	const [tasks, setTasks] = useState<Task[]>([]);

	useEffect(() => {
		const fetchTasks = async () => {
			const tasks = await getTasks(practiceId);
			if (tasks.ok) {
				setTasks(tasks.value);
			} else {
				showError(tasks.error.message);
			}
		};
		fetchTasks();
	}, [practiceId]);
	
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{tasks.map((task) => (
				<TaskComponent key={task.id} task={task} />
			))}
		</div>
	);
}