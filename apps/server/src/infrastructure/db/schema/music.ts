import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { arranger, composer } from "./composer.ts";
import { baseTimestampColumns } from "./time.ts";

export const music = mysqlTable("music", {
	id: int("id").primaryKey().autoincrement(),
	title: varchar("title", { length: 255 }).notNull(),
	composerId: int("composer_id")
		.notNull()
		.references(() => composer.id),
	arrangerId: varchar("arranger_id", { length: 255 })
		.notNull()
		.references(() => arranger.id),
	sheetMusicUrl: varchar("sheet_music_url", { length: 512 }),
	...baseTimestampColumns,
});
