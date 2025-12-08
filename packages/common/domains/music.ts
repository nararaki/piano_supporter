import type { Composer } from "./composer";

export interface Music {
    id: string;
    title: string;
    composer: Composer;
    sheetMusicUrl: string;
}