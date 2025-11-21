import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { baseTimestampColumns } from "./time.ts";

export const accounts = mysqlTable("accounts", {
	id: varchar("id", { length: 36 }).primaryKey().notNull(),
	lastName: varchar("last_name", { length: 10 }).notNull(),
	firstName: varchar("first_name", { length: 10 }).notNull(),
	email: varchar("email", { length: 40 }).notNull(),
	profileImage: varchar("profile_url", { length: 100 }),
	...baseTimestampColumns,
});
