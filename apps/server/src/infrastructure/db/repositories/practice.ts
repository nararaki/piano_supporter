import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import { db } from "../initial.ts";
import { practice } from "../schema/practice.ts";
import { music } from "../schema/music.ts";
import { composer } from "../schema/composer.ts";
import { eq } from "drizzle-orm";
import { uuidv7 } from "uuidv7";
import type { PracticeRepository, CreatePracticeRepositoryData } from "../../../repository/practice/repository.ts";
import type { Practice } from "@piano_supporter/common/domains/practice.ts";
import type { Music } from "@piano_supporter/common/domains/music.ts";
import type { Composer } from "@piano_supporter/common/domains/composer.ts";

class PracticeRepositoryClient implements PracticeRepository {
	async findById(id: string): Promise<Result<Practice>> {
		try {
			const [result] = await db
				.select()
				.from(practice)
				.where(eq(practice.id, id))
				.innerJoin(music, eq(practice.musicId, music.id))
				.innerJoin(composer, eq(music.composerId, composer.id))
				.limit(1)
				.execute();
			if (!result) {
				return err({
					type: "CANNOT_FIND_PRACTICE",
					message: "練習データが見つかりません",
				});
			}
			const practiceData = {
				id: result.practice.id,
				music: {
					id: result.music.id,
					title: result.music.title,
					composer: {
						id: result.composer.id,
						name: result.composer.name,
					} as Composer,
				},
				updatedAt: result.practice.updatedAt,
			} as Practice;
			return ok(practiceData);
		
		} catch (e) {
			console.log("練習データの取得に失敗しました", e);
			return err({
				type: "UNEXPECTED",
				message: "練習データの取得に失敗しました",
			});
		}
	}

	async findByRelationId(relationId: string): Promise<Result<Practice[]>> {
		try {
			const practices = await db
				.select({
					practice: practice,
					music: music,
					composer: composer,
				})
				.from(practice)
				.innerJoin(music, eq(practice.musicId, music.id))
				.innerJoin(composer, eq(music.composerId, composer.id))
				.where(eq(practice.accountSchoolRelationId, relationId))
				.execute();
				
			const result: Practice[] = practices.map((row) => ({
				id: row.practice.id,
				music: {
					id: row.music.id,
					title: row.music.title,
					composer: {
						id: row.composer.id,
						name: row.composer.name,
					} as Composer,
					sheetMusicUrl: row.music.sheetMusicUrl || "",
				} as Music,
				composer: {
					id: row.composer.id,
					name: row.composer.name,
				} as Composer,
				updatedAt: row.practice.updatedAt,
			}));

			return ok(result);
		} catch (e) {
			console.log("練習データの取得に失敗しました", e);
			return err({
				type: "UNEXPECTED",
				message: "練習データの取得に失敗しました",
			});
		}
	}

	async create(data: CreatePracticeRepositoryData): Promise<Result<Practice>> {
		try {
			const practiceId = uuidv7();
			const now = new Date();
			
			await db.insert(practice).values({
				id: practiceId,
				accountSchoolRelationId: data.accountSchoolRelationId,
				musicId: data.musicId,
				createdAt: now,
			});

			// 作成したpracticeを取得（musicとcomposerを含む）
			const [createdPractice] = await db
				.select({
					practice: practice,
					music: music,
					composer: composer,
				})
				.from(practice)
				.innerJoin(music, eq(practice.musicId, music.id))
				.innerJoin(composer, eq(music.composerId, composer.id))
				.where(eq(practice.id, practiceId))
				.limit(1)
				.execute();

			if (!createdPractice) {
				return err({
					type: "UNEXPECTED",
					message: "練習データの作成に失敗しました",
				});
			}

			const result: Practice = {
				id: createdPractice.practice.id,
				music: {
					id: createdPractice.music.id,
					title: createdPractice.music.title,
					composer: {
						id: createdPractice.composer.id,
						name: createdPractice.composer.name,
					} as Composer,
					sheetMusicUrl: createdPractice.music.sheetMusicUrl || "",
				} as Music,
				updatedAt: createdPractice.practice.updatedAt,
			};

			return ok(result);
		} catch (e) {
			console.log("練習データの作成に失敗しました", e);
			return err({
				type: "UNEXPECTED",
				message: "練習データの作成に失敗しました",
			});
		}
	}
}

export const newPracticeRepositoryClient = new PracticeRepositoryClient();

