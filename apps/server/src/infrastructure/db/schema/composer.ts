import {
	int,
	mysqlTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core";
import { baseTimestampColumns } from "./time.ts";

export const composer = mysqlTable('composer', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  ...baseTimestampColumns,
});

export const arranger = mysqlTable('arranger', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  ...baseTimestampColumns,
});