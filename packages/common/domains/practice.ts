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
    sheetMusicUrl?: string,
): Practice => {
    return {
        id: uuidv7(),
        music: music,
        sheetMusicUrl: sheetMusicUrl ?? "",
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

export const attachSheetMusicUrl = (practice: Practice, sheetMusicUrl: string): Practice => {
    return {
        ...practice,
        sheetMusicUrl: sheetMusicUrl,
    };
}