import { callApi } from "@/infrastructure/api/api";
import type { Task } from "@piano_supporter/common/domains/task.ts";
import { getTaskClient } from "@/infrastructure/api/task.ts";

export const getTasks = async (practiceId: string) => {
    return await getTaskClient(practiceId);
}