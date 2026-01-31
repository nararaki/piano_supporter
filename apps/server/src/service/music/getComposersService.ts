import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { Composer } from "@piano_supporter/common/domains/composer.ts";
import type { ComposerRepository } from "../../repository/composer/repository.ts";

export class GetComposersService {
	constructor(
		private composerRepository: ComposerRepository,
	) {}

	async exec(): Promise<Result<Composer[]>> {
		const result = await this.composerRepository.findAll();
		if (!result.ok) {
			return result;
		}

		return result;
	}
}

