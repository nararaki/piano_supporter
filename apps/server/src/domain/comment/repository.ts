import { Comment } from "./entity.ts";
export interface CommentRepository{
    findById(id:number) : Promise<Comment | null>;
    findRepliesByParentId(id:number) : Promise<Comment[] | []>;
    findByPostId(postId:number) : Promise<Comment[] | []>;
    saveComment(comment:Comment) : Promise<void>;
}