import type { Composer } from "./composer";

//value object
export interface Music {
    title: string;
    composer: Composer;
    sheetMusicUrl: string;
}