import { 
  mysqlTable, 
  varchar, 
  text, 
  timestamp, 
  int, 
} from 'drizzle-orm/mysql-core';
import { baseTimestampColumns } from './time.ts';
import { account } from './account.ts';
import { music } from './music.ts';

export const practice = mysqlTable('practice', {
  id: varchar('id', { length: 255 }).primaryKey(),
  accountId: varchar('account_id', { length: 255 }).notNull().references(() => account.id, { onDelete: 'cascade' }),
  musicId: varchar('music_id', { length: 255 }).notNull().references(() => music.id),
  ...baseTimestampColumns,
});