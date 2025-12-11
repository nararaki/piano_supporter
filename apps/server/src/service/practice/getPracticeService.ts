import type { Practice } from "@piano_supporter/common/domains/practice.ts";
import type { PracticeRepository } from "../../repository/practice/repository.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export class GetPracticeService {
	constructor(
		private practiceRepository: PracticeRepository,
	) {}

	async exec(practiceId: string): Promise<Result<Practice>> {
		const result = await this.practiceRepository.findById(practiceId);
		if (!result.ok) {
			return result;
		}
		return result;
	}
}
