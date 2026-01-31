import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { baseTimestampColumns } from "./time.ts";

export const composer = mysqlTable("composer", {
	id: int("id").primaryKey().autoincrement(),
	name: varchar("name", { length: 255 }).notNull(),
	...baseTimestampColumns,
});

export const arranger = mysqlTable("arranger", {
	id: varchar("id", { length: 255 }).primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	...baseTimestampColumns,
});
