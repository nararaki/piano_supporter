import { getPracticeById } from "@/infrastructure/api/practice";
import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { Practice } from "@piano_supporter/common/domains/practice.ts";

export const getPractice = async (
	practiceId: string,
): Promise<Result<Practice>> => {
	return await getPracticeById(practiceId);
};  