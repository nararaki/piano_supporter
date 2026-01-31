import { int, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";
import { task } from "./task.ts";
import { baseTimestampColumns } from "./time.ts";

export const annotation = mysqlTable("annotation", {
	id: varchar("id", { length: 255 }).primaryKey(),
	content: text("content").notNull(),
	taskId: varchar("task_id", { length: 255 })
		.references(() => task.id)
		.notNull(),
	sectionNumber: int("section_number").notNull(),
	timePosition: int("time_position").notNull(),
	...baseTimestampColumns,
});
