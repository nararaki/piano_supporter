import { 
  mysqlTable, 
  varchar, 
  text, 
} from 'drizzle-orm/mysql-core';
import { baseTimestampColumns } from './time.ts';
import { practice } from './practice.ts';

export const status = mysqlTable('status', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  ...baseTimestampColumns,
});

export const task = mysqlTable('task', {
  id: varchar('id', { length: 255 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  statusId: varchar('status_id', { length: 255 }).notNull().references(() => status.id),
  practiceId: varchar('practice_id', { length: 255 }).notNull().references(() => practice.id),
  ...baseTimestampColumns,
});