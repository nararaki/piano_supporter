import type { createTaskData } from "@piano_supporter/common/commonResponseType/honoRequest.ts";
import type { TaskRepository } from "src/repository/task/repository.ts";
import type { AnnotationRepository } from "src/repository/annotation/repository.ts";
import { createAnnotationEntity, createTaskEntity, TaskStatus } from "@piano_supporter/common/domains/task.ts";
import { ok, err } from "@piano_supporter/common/lib/error.ts";
import type { PracticeRepository } from "src/repository/practice/repository.ts";
import type { XmlEditService } from "./xmlEditService.ts";

export class CreateTaskService{
    constructor (
        private taskRepository: TaskRepository,
        private annotationRepository: AnnotationRepository,
        private practiceRepository: PracticeRepository,
        private xmlEditService: XmlEditService
    ) {}

    async exec(data:createTaskData){
        const annotation = createAnnotationEntity(data.content,data.sectionNumber,data.timePosition);
        const task = createTaskEntity(data.title,[annotation],TaskStatus.PROGRESS,data.practiceId);
        const practiceResult = await this.practiceRepository.findById(data.practiceId);
        if (!practiceResult.ok) {
            return practiceResult;
        }
        
        const practice = practiceResult.value;
        if (!practice.sheetMusicUrl) {
            return err({
                type: "NOT_FOUND",
                message: "楽譜のURLが設定されていません",
            });
        }

        // 楽譜を更新してS3に保存
        const xmlEditResult = await this.xmlEditService.exec({
            xmlUrl: practice.sheetMusicUrl,
            sectionNumber: annotation.sectionNumber,
            timePosition: annotation.timePosition,
            directionContent: annotation.content,
        });
        if (!xmlEditResult.ok) {
            return err({
                type: "SERVER_ERROR",
                message: "楽譜の更新に失敗しました",
            });
        }
        
        const taskResult = await this.taskRepository.createTask(task);
        if (!taskResult.ok) {
            return taskResult;
        }
        const annotationResult = await this.annotationRepository.create(annotation,task.id);
        if (!annotationResult.ok) {
            return annotationResult;
        }
        return ok(task);
    }
}