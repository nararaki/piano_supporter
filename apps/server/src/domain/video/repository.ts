import { VideoEntity } from "./entity";

export interface VideoRepository {
    findById(id:number) : Promise<VideoEntity>;
}