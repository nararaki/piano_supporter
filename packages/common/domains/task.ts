import { uuidv7 } from "uuidv7";

export interface Task {
    id: string;
    title: string;
    annotation: Annotation[]
    status: TaskStatus;
    practiceId: string;
    createdAt: Date;
    updatedAt: Date;
}

export const createTaskEntity = (
    title: string,
    annotation: Annotation[],
    status: TaskStatus,
    practiceId: string,
): Task => {
    return {
        id: uuidv7(),
        title: title,
        annotation: annotation,
        status: status,
        practiceId: practiceId,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

export interface Annotation {
    id: string;
    content: string;
    sectionNumber: number;
    timePosition: number;   
}

export const createAnnotationEntity = (
    content: string,
    sectionNumber: number,
    timePosition: number,
): Annotation => {
    return {
        id: uuidv7(),
        content: content,
        sectionNumber: sectionNumber,
        timePosition: timePosition,
    };
}

export enum TaskStatus {
    PROGRESS = "progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
}