import type { Task } from "@piano_supporter/common/domains/task.ts";
import type { TaskRepository } from "../../repository/task/repository.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export class GetTasksService {
	constructor(
		private taskRepository: TaskRepository,
	) {}

	async exec(practiceId: string): Promise<Result<Task[]>> {
		const result = await this.taskRepository.findByPracticeId(practiceId);
		if (!result.ok) {
			return result;
		}
		return result;
	}
}

