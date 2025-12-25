import type { TaskRepository } from "src/repository/task/repository.ts";
import { Task } from "@piano_supporter/common/domains/task.ts";
import { type Result,ok,err } from "@piano_supporter/common/lib/error.ts";
import { db } from "../initial.ts";
import { task } from "../schema/task.ts"
import { uuidv7 } from "uuidv7";

export class taskRepositoryClient implements TaskRepository{
    async createTask(data:Task):Promise<Result<Task>>{
        try{
            const taskId = uuidv7();
            await db
                .insert(task)
                .values({
                    id: taskId,
                    title: data.title,
                    practiceId: data.practiceId,
                    status: data.status,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                .execute();
            return ok(data);
        } catch(e){
            return err({
                type: "UNEXPECTED",
                message: "タスクの作成に失敗しました" + e,
            });
        }
    }
}

export const newTaskRepositoryClient = new taskRepositoryClient();