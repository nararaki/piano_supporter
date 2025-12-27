import type { Task } from "@piano_supporter/common/domains/task.ts";
import type { Result } from "@piano_supporter/common/lib/error.js";

export interface TaskRepository{
    createTask(data:Task): Promise<Result<Task>>;
    findByPracticeId(practiceId: string): Promise<Result<Task[]>>;
}