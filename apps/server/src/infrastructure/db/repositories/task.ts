import type { TaskRepository } from "src/repository/task/repository.ts";
import type { Task } from "@piano_supporter/common/domains/task.js";
import { ok, err, type Result } from "@piano_supporter/common/lib/error.js";
import { db } from "../initial.ts";
import { task } from "../schema/task.ts";
import { annotation } from "../schema/annotation.ts";
import { eq } from "drizzle-orm";

class TaskRepositoryClient implements TaskRepository{
    async createTask(data:Task):Promise<Result<Task>>{
        try {
            await db.insert(task).values({
                id: data.id,
                title: data.title,
                practiceId: data.practiceId,
                status: data.status,
            });
            return ok(data);
        } catch (e) {
            console.log("タスクの作成に失敗しました", e);
            return err({
                type: "UNEXPECTED",
                message: "タスクの作成に失敗しました",
            });
        }
    }

    async findByPracticeId(practiceId:string):Promise<Result<Task[]>>{
        try {
            const rows = await db
                .select()
                .from(task)
                .innerJoin(annotation, eq(task.id, annotation.taskId))
                .where(eq(task.practiceId, practiceId))
                .execute();

            const taskMap = rows.reduce((map, row) => {
                const t = row.task;
                const a = row.annotation;

                const taskEntry = map.get(t.id) ?? {
                    id: t.id,
                    title: t.title,
                    practiceId: t.practiceId,
                    status: t.status as Task["status"],
                    annotation: [],
                    createdAt: t.createdAt,
                    updatedAt: t.updatedAt,
                };

                taskEntry.annotation.push({
                    id: a.id,
                    content: a.content,
                    sectionNumber: a.sectionNumber,
                    timePosition: a.timePosition,
                });

                return map.set(t.id, taskEntry);
            }, new Map<string, Task>());

            return ok(Array.from(taskMap.values()));
        } catch (e) {
            console.log("タスクの取得に失敗しました", e);
            return err({
                type: "UNEXPECTED",
                message: "タスクの取得に失敗しました",
            });
        }
    }
}

export const newTaskRepositoryClient = new TaskRepositoryClient();