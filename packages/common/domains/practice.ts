import type { Music } from "./music";
import type { Composer } from "./composer";

export interface Practice { 
    id: string;
    music: Music;
    updatedAt: Date;
}