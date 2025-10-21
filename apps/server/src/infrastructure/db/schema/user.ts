import {
  mysqlTable,
  varchar,
  int,
  text,
  timestamp, 
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey().notNull(),
  userName: varchar('user_name', { length: 16 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
});