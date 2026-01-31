import { 
  mysqlTable, 
  varchar, 
  text, 
} from 'drizzle-orm/mysql-core';
import { baseTimestampColumns } from './time.ts';
import { accountSchoolRelation } from './role.ts';

export const post = mysqlTable('post', {
  id: varchar('id', { length: 255 }).primaryKey(),
  accountSchoolRelationId: varchar('account_school_relation_id', { length: 255 }).notNull().references(() => accountSchoolRelation.id),
  title: varchar('title', { length: 255 }),
  content: text('content'),
  ...baseTimestampColumns,
});
