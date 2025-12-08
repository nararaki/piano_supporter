import { 
  mysqlTable, 
  varchar, 
} from 'drizzle-orm/mysql-core';
import { baseTimestampColumns } from './time.ts';
import { music } from './music.ts';
import { accountSchoolRelation } from './index.ts';

export const practice = mysqlTable('practice', {
  id: varchar('id', { length: 255 }).primaryKey(),
  accountSchoolRelationId: varchar('account_school_relation_id', { length: 255 }).notNull().references(() => accountSchoolRelation.id),
  musicId: varchar('music_id', { length: 255 }).notNull().references(() => music.id),
  ...baseTimestampColumns,
});