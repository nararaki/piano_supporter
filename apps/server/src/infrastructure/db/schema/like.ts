import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { account } from "./account.ts";
import { comment } from "./comment.ts";
import { post } from "./post.ts";
import { baseTimestampColumns } from "./time.ts";

export const postLike = mysqlTable("post_like", {
	id: varchar("id", { length: 255 }).primaryKey(),
	postId: varchar("post_id", { length: 255 })
		.notNull()
		.references(() => post.id),
	accountId: varchar("account_id", { length: 255 })
		.notNull()
		.references(() => account.id),
	...baseTimestampColumns,
});

export const commentLike = mysqlTable("comment_like", {
	id: varchar("id", { length: 255 }).primaryKey(),
	commentId: varchar("comment_id", { length: 255 })
		.notNull()
		.references(() => comment.id),
	accountId: varchar("account_id", { length: 255 })
		.notNull()
		.references(() => account.id),
	...baseTimestampColumns,
});
