import {
  mysqlTable,
  varchar,
  int,
  text,
  timestamp, 
} from 'drizzle-orm/mysql-core';

export const musics = mysqlTable('music', {
  id: int('id').autoincrement().primaryKey().notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  composerId: int('composer_id').notNull(),
});