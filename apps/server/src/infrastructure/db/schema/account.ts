import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { baseTimestampColumns } from "./time.ts";

export const account = mysqlTable("account", {
	id: varchar("id", { length: 255 }).primaryKey(),
	lastName: varchar("last_name", { length: 36 }).notNull(),
	firstName: varchar("first_name", { length: 36 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(), // メールはユニークに
	profileImage: varchar("profile_url", { length: 100 }),
	...baseTimestampColumns,
});
