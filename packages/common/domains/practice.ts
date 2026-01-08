import type { Music } from "./music";
import { uuidv7 } from "uuidv7";

export interface Practice { 
    id: string;
    music: Music;
    sheetMusicUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

export const createPracticeEntity = (
    music: Music,
): Practice => {
    const id = uuidv7();
    return {
        id: id,
        music: music,
        sheetMusicUrl: `practice/${id}.xml`,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

export const updatePracticeEntity = (
    practice: Practice,
    sheetMusicUrl: string,
): Practice => {
    return {
        ...practice,
        sheetMusicUrl: sheetMusicUrl,
        updatedAt:new Date(),
    };
}