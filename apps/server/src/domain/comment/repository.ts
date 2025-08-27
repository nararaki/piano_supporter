import { CommentData } from "../comment/entity.ts";
export interface CommentRepository{
    findById(id:string) : Promise<CommentData | null>;
    findReplyById(id:string) : Promise<CommentData[] | null>;
}