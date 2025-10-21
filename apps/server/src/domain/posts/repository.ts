import { Post } from "./entity";

export interface PostsRepository {
    findById(id:number) : Promise<Post | null>;
    findByUserId(userId:string) : Promise<Post[] | []>;
    savePost(post:Post) : Promise<void>;
}
