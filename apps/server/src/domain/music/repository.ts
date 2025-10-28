import { Music } from "./types.ts";
export interface MusicRepository  {
    findById(id:number) : Promise<Music| null>;
}