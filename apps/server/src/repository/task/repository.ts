import { createTaskData } from "@piano_supporter/common/commonResponseType/honoRequest.js";
import type { Task } from "@piano_supporter/common/domains/task.js";
import type { Result } from "@piano_supporter/common/lib/error.js";

export interface TaskRepository{
    createTask(data:Task): Promise<Result<Task>>;
    findByPracticeId(practiceId: string): Promise<Result<Task[]>>;
}