import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { Practice } from "@piano_supporter/common/domains/practice.ts";
import { err } from "@piano_supporter/common/lib/error.ts";
import type { SchoolMembershipRepository } from "../../repository/schoolMembership/repository.ts";
import type { PracticeRepository } from "../../repository/practice/repository.ts";
import type { createPracticeData } from "@piano_supporter/common/commonResponseType/honoRequest.ts";
import type { MusicRepository } from "src/repository/music/repository.ts";
import { mediaStorage } from "../container/index.ts";
import { attachSheetMusicUrl, createPracticeEntity } from "@piano_supporter/common/domains/practice.ts";

export class CreatePracticeService {
	constructor(
		private schoolMembershipRepository: SchoolMembershipRepository,
		private practiceRepository: PracticeRepository,
		private musicRepository: MusicRepository,
	) {}

	async exec(data: createPracticeData): Promise<Result<Practice>> {
		const membershipResult = await this.schoolMembershipRepository.findByAccountIdAndSchoolId(
			data.accountId,
			data.schoolId,
		);

		if (!membershipResult.ok) {
			return err({
				type: "CANNOT_FIND_SCHOOL",
				message: "スクールに登録されていません",
			});
		}
		const membership = membershipResult.value;
		const musicResult = await this.musicRepository.findByTitle(data.musicTitle);
		if (!musicResult.ok) {
			return err({
				type: "NOT_FOUND",
				message: "楽曲が見つかりません",
			});
		}
		const music = musicResult.value;
		const practice = createPracticeEntity(music);

		const createPracticeStorageResult = await mediaStorage.createPracticeStorage(music, practice);
		if (!createPracticeStorageResult.ok) {
			return createPracticeStorageResult;
		}
		const newPractice = attachSheetMusicUrl(practice, createPracticeStorageResult.value);
		const practiceResult = await this.practiceRepository.create(newPractice, membership, music);
		if (!practiceResult.ok) {
			return practiceResult;
		}
		return practiceResult;
	}
}
