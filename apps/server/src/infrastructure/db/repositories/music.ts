import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import { db } from "../initial.ts";
import { music } from "../schema/music.ts";
import { composer } from "../schema/composer.ts";
import { eq } from "drizzle-orm";
import type { MusicRepository } from "../../../repository/music/repository.ts";
import type { Music } from "@piano_supporter/common/domains/music.ts";
import type { Composer } from "@piano_supporter/common/domains/composer.ts";

class MusicRepositoryClient implements MusicRepository {
	async findByComposerId(composerId: string): Promise<Result<Music[]>> {
		try {
			const data = await db
				.select({
					music: music,
					composer: composer,
				})
				.from(music)
				.innerJoin(composer, eq(music.composerId, composer.id))
				.where(eq(music.composerId, composerId))
				.execute();

			const musics: Music[] = data.map((row) => ({
				id: row.music.id,
				title: row.music.title,
				composer: {
					id: row.composer.id,
					name: row.composer.name,
				} as Composer,
				sheetMusicUrl: row.music.sheetMusicUrl || "",
			}));

			return ok(musics);
		} catch (e) {
			console.log("楽曲データの取得に失敗しました", e);
			return err({
				type: "UNEXPECTED",
				message: "楽曲データの取得に失敗しました",
			});
		}
	}

	async findByMusicId(musicId: string): Promise<Result<Music>> {
		try {
			const data = await db
				.select({
					music: music,
					composer: composer,
				})
				.from(music)
				.innerJoin(composer, eq(music.composerId, composer.id))
				.where(eq(music.id, musicId))
				.execute();

			if (data.length === 0) {
				return err({
					type: "NOT_FOUND",
					message: "楽曲データが見つかりません",
				});
			}

			const row = data[0];
			const musicData: Music = {
				id: row.music.id,
				title: row.music.title,
				composer: {
					id: row.composer.id,
					name: row.composer.name,
				} as Composer,
				sheetMusicUrl: row.music.sheetMusicUrl || "",
			};

			return ok(musicData);
		} catch (e) {
			console.log("楽曲データの取得に失敗しました", e);
			return err({
				type: "UNEXPECTED",
				message: "楽曲データの取得に失敗しました",
			});
		}
	}
}

export const newMusicRepositoryClient = new MusicRepositoryClient();

