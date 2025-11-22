import { 
  mysqlTable, 
  varchar, 
  text, 
} from 'drizzle-orm/mysql-core';
import { baseTimestampColumns } from './time.ts';
import { account } from './account.ts';

export const post = mysqlTable('post', {
  id: varchar('id', { length: 255 }).primaryKey(),
  accountId: varchar('account_id', { length: 255 }).notNull().references(() => account.id),
  title: varchar('title', { length: 255 }),
  content: text('content'),
  ...baseTimestampColumns,
});
