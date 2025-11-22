import {
	mysqlTable,
	varchar,
} from "drizzle-orm/mysql-core";
import { baseTimestampColumns } from "./time.ts";

export const school = mysqlTable("school", {
	id: varchar("id",{length:36}).primaryKey().notNull(),
	name: varchar("name", { length: 30 }).notNull(),
	location: varchar("location", { length: 60 }).notNull(),
	email: varchar("email", { length: 40 }).notNull(),
	shareCode: varchar("shareCode", { length: 40 }).notNull(),
	...baseTimestampColumns,
});
