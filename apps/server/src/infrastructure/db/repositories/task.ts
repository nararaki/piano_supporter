import type { TaskRepository } from "src/repository/task/repository.ts";
import type { Task, Annotation } from "@piano_supporter/common/domains/task.ts";
import { type Result,ok,err } from "@piano_supporter/common/lib/error.ts";
import { db } from "../initial.ts";
import { task } from "../schema/task.ts";
import { annotation } from "../schema/annotation.ts";
import { eq } from "drizzle-orm";

export class taskRepositoryClient implements TaskRepository{
    async createTask(data:Task):Promise<Result<Task>>{
        try{
            await db
                .insert(task)
                .values({
                    id: data.id,
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

    async findByPracticeId(practiceId: string): Promise<Result<Task[]>> {
        try {
            const tasks = await db
                .select()
                .from(task)
                .where(eq(task.practiceId, practiceId))
                .execute();

            const tasksWithAnnotations: Task[] = await Promise.all(
                tasks.map(async (t) => {
                    const annotations = await db
                        .select()
                        .from(annotation)
                        .where(eq(annotation.taskId, t.id))
                        .execute();

                    const annotationList: Annotation[] = annotations.map((a) => ({
                        id: a.id,
                        content: a.content,
                        sectionNumber: a.sectionNumber,
                        timePosition: a.timePosition,
                    }));

                    return {
                        id: t.id,
                        title: t.title,
                        annotation: annotationList,
                        status: t.status as Task["status"],
                        practiceId: t.practiceId,
                        createdAt: t.createdAt,
                        updatedAt: t.updatedAt,
                    } as Task;
                })
            );

            return ok(tasksWithAnnotations);
        } catch (e) {
            return err({
                type: "UNEXPECTED",
                message: "タスクの取得に失敗しました" + e,
            });
        }
    }
}

export const newTaskRepositoryClient = new taskRepositoryClient();