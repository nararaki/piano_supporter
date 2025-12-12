import { getComposers as getComposersApi } from "@/infrastructure/api/composer";
import type { Composer } from "@piano_supporter/common/domains/composer.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export const getComposers = async (): Promise<Result<Composer[]>> => {
	return await getComposersApi();
};

