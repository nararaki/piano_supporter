import type { Annotation } from "@piano_supporter/common/domains/task.ts";
import { ok, Result,err } from "@piano_supporter/common/lib/error.ts";
import { db } from "../initial.ts";
import { annotation } from "../schema/annotation.ts";
import type { AnnotationRepository } from "../../../repository/annotation/repository.ts";

export class AnnotationRepositoryClient implements AnnotationRepository{
    async create(data: Annotation, taskId: string): Promise<Result<Annotation>> {
        try {
            await db.insert(annotation).values({
                id: data.id,
                content: data.content,
                taskId: taskId,
                sectionNumber: data.sectionNumber,
                timePosition: data.timePosition,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            return ok(data);
        } catch (error) {
            console.error(error);
            return err({
                type: "UNEXPECTED",
                message: "アノテーションの作成に失敗しました" + error,
            });
        }
    }
}

export const newAnnotationRepositoryClient = new AnnotationRepositoryClient();