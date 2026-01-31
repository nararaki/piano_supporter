import type { Music } from "@piano_supporter/common/domains/music.ts";
import type { Practice } from "@piano_supporter/common/domains/practice.ts";
import type { SchoolMembership } from "@piano_supporter/common/domains/schoolMembership.ts";
import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import { eq } from "drizzle-orm";
import type { PracticeRepository } from "../../../repository/practice/repository.ts";
import { db } from "../initial.ts";
import { composer } from "../schema/composer.ts";
import { music } from "../schema/music.ts";
import { practice } from "../schema/practice.ts";

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
			const practiceData: Practice = {
				id: result.practice.id,
				music: {
					title: result.music.title,
					composer: {
						name: result.composer.name,
					},
					sheetMusicUrl: result.music.sheetMusicUrl || "",
				},
				sheetMusicUrl: result.practice.sheetMusicUrl || "",
				createdAt: result.practice.createdAt,
				updatedAt: result.practice.updatedAt,
			};
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
					title: row.music.title,
					composer: {
						name: row.composer.name,
					},
					sheetMusicUrl: row.music.sheetMusicUrl || "",
				},
				sheetMusicUrl: row.practice.sheetMusicUrl || "",
				createdAt: row.practice.createdAt,
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

	async create(
		data: Practice,
		membership: SchoolMembership,
		musicData: Music,
	): Promise<Result<Practice>> {
		try {
			const musicId = await this.findMusicId(musicData);
			if (!musicId.ok) {
				return musicId;
			}
			await db.insert(practice).values({
				id: data.id,
				accountSchoolRelationId: membership.id,
				musicId: musicId.value,
				sheetMusicUrl: data.sheetMusicUrl,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			});

			return ok(data);
		} catch (e) {
			console.log("練習データの作成に失敗しました", e);
			return err({
				type: "UNEXPECTED",
				message: "練習データの作成に失敗しました",
			});
		}
	}

	private async findMusicId(musicData: Music): Promise<Result<number>> {
		try {
			const [result] = await db
				.select({ id: music.id })
				.from(music)
				.where(eq(music.title, musicData.title))
				.limit(1)
				.execute();
			if (!result) {
				return err({
					type: "NOT_FOUND",
					message: "楽曲が見つかりません",
				});
			}
			return ok(result.id);
		} catch (e) {
			console.log("楽曲IDの取得に失敗しました", e);
			return err({
				type: "UNEXPECTED",
				message: "楽曲IDの取得に失敗しました",
			});
		}
	}
}

export const newPracticeRepositoryClient = new PracticeRepositoryClient();
