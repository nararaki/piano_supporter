import type { Composer } from "@piano_supporter/common/domains/composer.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export interface ComposerRepository {
	findAll(): Promise<Result<Composer[]>>;
}

