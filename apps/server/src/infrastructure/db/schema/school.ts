import {
  mysqlTable,
  varchar,
  int,
  text,
  timestamp, 
} from 'drizzle-orm/mysql-core';
import { baseTimestampColumns } from './time.ts';

export const schoolScheme = mysqlTable('school', {
  id: int('id').autoincrement().primaryKey().notNull(),
  name: varchar('name',{length: 30}).notNull(),
  location:varchar('location',{length: 60}).notNull(),
  email: varchar('email',{length:40}).notNull(),
  shareCode: varchar('shareCode',{length:40}),
  ...baseTimestampColumns
});