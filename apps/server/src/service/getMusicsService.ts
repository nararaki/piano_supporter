import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { Music } from "@piano_supporter/common/domains/music.ts";
import type { MusicRepository } from "../repository/music/repository.ts";

export class GetMusicsService {
	constructor(
		private musicRepository: MusicRepository,
	) {}

	async exec(composerId: string): Promise<Result<Music[]>> {
		const result = await this.musicRepository.findByComposerId(composerId);
		if (!result.ok) {
			return result;
		}

		return result;
	}
}

