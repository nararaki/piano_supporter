import { getMusicsByComposerName } from "@/infrastructure/api/music";
import type { Music } from "@piano_supporter/common/domains/music.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export const getMusics = async (composerName: string): Promise<Result<Music[]>> => {
	return await getMusicsByComposerName(composerName);
};

