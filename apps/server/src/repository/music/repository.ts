import type { Music } from "@piano_supporter/common/domains/music.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export interface MusicRepository {
	findByComposerId(composerId: string): Promise<Result<Music[]>>;
	findByMusicId(musicId: string): Promise<Result<Music>>;
}

