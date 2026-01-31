import type { Music } from "@piano_supporter/common/domains/music.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export interface MusicRepository {
	findByComposer(composerName: string): Promise<Result<Music[]>>;
	findByTitle(musicTitle: string): Promise<Result<Music>>;
	findByMusicId(musicId: string): Promise<Result<Music>>;
	findMusicIdByTitle(title: string): Promise<Result<string>>;
}

