import { 
  mysqlTable, 
  varchar, 
} from 'drizzle-orm/mysql-core';
import { account } from './account.ts';
import { school } from './school.ts';
import { baseTimestampColumns } from './time.ts';

export const roles = mysqlTable('role', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  ...baseTimestampColumns,
});

// アカウントとスクールの中間テーブル
export const accountSchoolRelation = mysqlTable('account_school_relation', {
  id: varchar('id', { length: 255 }).primaryKey(),
  accountId: varchar('account_id', { length: 255 }).notNull().references(() => account.id, { onDelete: 'cascade' }),
  schoolId: varchar('school_id', { length: 255 }).notNull().references(() => school.id, { onDelete: 'cascade' }),
  ...baseTimestampColumns,
});

// リレーション内の役割定義
export const accountRoles = mysqlTable('account_role', {
  id: varchar('id', { length: 255 }).primaryKey(),
  accountSchoolRelationId: varchar('account_school_relation_id', { length: 255 })
    .notNull()
    .references(() => accountSchoolRelation.id, { onDelete: 'cascade' }),
  roleId: varchar('role_id', { length: 255 }).notNull().references(() => roles.id),
  ...baseTimestampColumns,
});