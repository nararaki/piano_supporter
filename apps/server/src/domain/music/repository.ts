import { Music } from "./types";
export interface MusicRepository  {
    findById(id:number) : Promise<Music| null>;
}