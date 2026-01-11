import { 
  mysqlTable, 
  varchar, 
  text, 
} from 'drizzle-orm/mysql-core';
import { baseTimestampColumns } from './time.ts';
import { account } from './account.ts';
import { school } from './school.ts';

export const post = mysqlTable('post', {
  id: varchar('id', { length: 255 }).primaryKey(),
  accountId: varchar('account_id', { length: 255 }).notNull().references(() => account.id),
  schoolId: varchar('school_id', { length: 255 }).notNull().references(() => school.id),
  title: varchar('title', { length: 255 }),
  content: text('content'),
  ...baseTimestampColumns,
});
