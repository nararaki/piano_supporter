import {
  mysqlTable,
  varchar,
  int,
  text,
  timestamp, 
} from 'drizzle-orm/mysql-core';

export const composers = mysqlTable('composers', { 
  id: int('id').autoincrement().primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
});