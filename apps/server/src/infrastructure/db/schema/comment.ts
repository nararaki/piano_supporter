import {
	int,
	mysqlTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core";

export const comments = mysqlTable("comments", {
	id: int("id").autoincrement().primaryKey().notNull(),
	postId: int("post_id").notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	content: text("content").notNull(),
	sectionNumber: int("section_number").notNull(),
	parentId: int("parent_id"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});
