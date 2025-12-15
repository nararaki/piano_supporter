import { getMusicsByComposerId } from "@/infrastructure/api/music";
import type { Music } from "@piano_supporter/common/domains/music.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export const getMusics = async (composerId: string): Promise<Result<Music[]>> => {
	return await getMusicsByComposerId(composerId);
};

