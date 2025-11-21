import {
	int,
	mysqlTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core";

export const videos = mysqlTable("videos", {
	id: int("id").autoincrement().primaryKey().notNull(),
	postId: int("post_id").notNull(),
	url: text("url").notNull(),
});
