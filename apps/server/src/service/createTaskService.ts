import type { createTaskData } from "@piano_supporter/common/commonResponseType/honoRequest.ts";
import type { TaskRepository } from "src/repository/task/repository.ts";
import type { AnnotationRepository } from "src/repository/annotation/repository.ts";
import { createAnnotationEntity, createTaskEntity, TaskStatus } from "@piano_supporter/common/domains/task.ts";
import { ok } from "@piano_supporter/common/lib/error.ts";

export class CreateTaskService{
    constructor (
        private taskRepository: TaskRepository,
        private annotationRepository: AnnotationRepository
    ) {}

    async exec(data:createTaskData){
        const annotation = createAnnotationEntity(data.content,data.sectionNumber,data.timePosition);
        const task = createTaskEntity(data.title,[annotation],TaskStatus.PROGRESS,data.practiceId);
        const annotationResult = await this.annotationRepository.create(annotation);
        if (!annotationResult.ok) {
            return annotationResult;
        }
        const taskResult = await this.taskRepository.createTask(task);
        if (!taskResult.ok) {
            return taskResult;
        }
        return ok(task);
    }
}