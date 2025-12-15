import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { Practice } from "@piano_supporter/common/domains/practice.ts";
import { err } from "@piano_supporter/common/lib/error.ts";
import type { AccountSchoolRelationRepository } from "../../repository/accountSchoolRelation/repository.ts";
import type { PracticeRepository } from "../../repository/practice/repository.ts";
import type { createPracticeData } from "@piano_supporter/common/commonResponseType/honoResponse.ts";

export class CreatePracticeService {
	constructor(
		private accountSchoolRelationRepository: AccountSchoolRelationRepository,
		private practiceRepository: PracticeRepository,
	) {}

	async exec(data: createPracticeData): Promise<Result<Practice>> {
		// accountIdとschoolIdからAccountSchoolRelationを取得
		const relationResult = await this.accountSchoolRelationRepository.findByAccountIdAndSchoolId(
			data.accountId,
			data.schoolId,
		);
		
		if (!relationResult.ok) {
			return err({
				type: "CANNOT_FIND_SCHOOL",
				message: "スクールに登録されていません",
			});
		}

		const relationId = relationResult.value.id;

		// 練習を作成
		const createResult = await this.practiceRepository.create({
			accountSchoolRelationId: relationId,
			musicId: data.musicId,
		});

		if (!createResult.ok) {
			return createResult;
		}

		return createResult;
	}
}

