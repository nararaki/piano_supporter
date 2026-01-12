import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { Practice } from "@piano_supporter/common/domains/practice.ts";
import { err } from "@piano_supporter/common/lib/error.ts";
import type { AccountSchoolRelationRepository } from "../../repository/accountSchoolRelation/repository.ts";
import type { PracticeRepository } from "../../repository/practice/repository.ts";
import type { createPracticeData } from "@piano_supporter/common/commonResponseType/honoRequest.ts";
import type { MusicRepository } from "src/repository/music/repository.ts";
import { newMediaStorage } from "../container/index.ts";
import { createPracticeEntity, updatePracticeEntity } from "@piano_supporter/common/domains/practice.ts";

export class CreatePracticeService {
	constructor(
		private accountSchoolRelationRepository: AccountSchoolRelationRepository,
		private practiceRepository: PracticeRepository,
		private musicRepository: MusicRepository,
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

		const musicResult = await this.musicRepository.findByTitle(data.musicTitle);
		if (!musicResult.ok) {
			return err({
				type: "NOT_FOUND",
				message: "楽曲が見つかりません",
			});
		}
		const music = musicResult.value;
		
		// DBに保存するために、titleからIDを取得
		const musicIdResult = await this.musicRepository.findMusicIdByTitle(data.musicTitle);
		if (!musicIdResult.ok) {
			return err({
				type: "NOT_FOUND",
				message: "楽曲IDが見つかりません",
			});
		}
		const musicId = musicIdResult.value;
		
		const sheetMusicUrl = music.sheetMusicUrl;
		const sheetMusic = await newMediaStorage.get(sheetMusicUrl);
		if (!sheetMusic.ok) {
			return err({
				type: "NOT_FOUND",
				message: "楽譜元データが見つかりません",
			});
		}
		const practice = createPracticeEntity(music);
		const putResult = await newMediaStorage.put(practice.sheetMusicUrl, sheetMusic.value, "application/xml");
		if (!putResult.ok) {
			return err({
				type: "FILE_UPLOAD_ERROR",
				message: "シートミュージックのアップロードに失敗しました",
			});
		}
		const newSheetMusicUrl = newMediaStorage.getCloudFrontUrl(practice.sheetMusicUrl);
		const updatedPractice = updatePracticeEntity(practice, newSheetMusicUrl);
		const practiceResult = await this.practiceRepository.create(updatedPractice, relationResult.value.id, musicId);
		if (!practiceResult.ok) {
			return practiceResult;
		}
		return practiceResult;
	}
}

