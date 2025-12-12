import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { Practice } from "@piano_supporter/common/domains/practice.ts";
import type { createPracticeData } from "@piano_supporter/common/commonResponseType/honoResponse.ts";
import { createPractice as createPracticeApi } from "@/infrastructure/api/practice";

export const createPractice = async (
	data: createPracticeData,
): Promise<Result<Practice>> => {
	return await createPracticeApi(data);
};