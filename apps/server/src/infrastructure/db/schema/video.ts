import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { post } from "./post.ts";
import { baseTimestampColumns } from "./time.ts";

export const video = mysqlTable("video", {
	id: varchar("id", { length: 255 }).primaryKey(),
	postId: varchar("post_id", { length: 255 })
		.notNull()
		.references(() => post.id),
	url: varchar("url", { length: 512 }).notNull(),
	type: varchar("type", { length: 50 }),
	...baseTimestampColumns,
});
