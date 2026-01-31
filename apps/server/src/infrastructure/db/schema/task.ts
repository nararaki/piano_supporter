import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { practice } from "./practice.ts";
import { baseTimestampColumns } from "./time.ts";

export const task = mysqlTable("task", {
	id: varchar("id", { length: 255 }).primaryKey(),
	title: varchar("title", { length: 255 }).notNull(),
	practiceId: varchar("practice_id", { length: 255 })
		.notNull()
		.references(() => practice.id),
	status: varchar("status", { length: 255 }).notNull(),
	...baseTimestampColumns,
});
