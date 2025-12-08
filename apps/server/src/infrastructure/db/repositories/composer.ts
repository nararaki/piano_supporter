import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import { db } from "../initial.ts";
import { composer } from "../schema/composer.ts";
import type { ComposerRepository } from "../../../repository/composer/repository.ts";
import type { Composer } from "@piano_supporter/common/domains/composer.ts";

class ComposerRepositoryClient implements ComposerRepository {
	async findAll(): Promise<Result<Composer[]>> {
		try {
			const data = await db
				.select()
				.from(composer)
				.execute();

			const composers: Composer[] = data.map((row) => ({
				id: row.id,
				name: row.name,
			}));

			return ok(composers);
		} catch (e) {
			console.log("作曲家データの取得に失敗しました", e);
			return err({
				type: "UNEXPECTED",
				message: "作曲家データの取得に失敗しました",
			});
		}
	}
}

export const newComposerRepositoryClient = new ComposerRepositoryClient();

