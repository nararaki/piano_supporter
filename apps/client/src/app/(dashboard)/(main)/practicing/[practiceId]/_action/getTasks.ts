import { getTaskClient } from "@/infrastructure/api/task.ts";

export const getTasks = async (practiceId: string) => {
    return await getTaskClient(practiceId);
}