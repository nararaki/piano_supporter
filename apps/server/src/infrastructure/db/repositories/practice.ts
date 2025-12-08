import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import { db } from "../initial.ts";
import { practice } from "../schema/practice.ts";
import { music } from "../schema/music.ts";
import { composer } from "../schema/composer.ts";
import { eq } from "drizzle-orm";
import type { PracticeRepository } from "../../../repository/practice/repository.ts";
import type { Practice } from "@piano_supporter/common/domains/practice.ts";
import type { Music } from "@piano_supporter/common/domains/music.ts";
import type { Composer } from "@piano_supporter/common/domains/composer.ts";

class PracticeRepositoryClient implements PracticeRepository {
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
}

export const newPracticeRepositoryClient = new PracticeRepositoryClient();

