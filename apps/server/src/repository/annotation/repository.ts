import type { Result } from "@piano_supporter/common/lib/error.js";
import type { Annotation } from "@piano_supporter/common/domains/task.js";

export interface AnnotationRepository{
    create(data:Annotation, taskId: string):Promise<Result<Annotation>>;
}