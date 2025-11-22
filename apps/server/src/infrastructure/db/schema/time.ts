import { 
  mysqlTable, 
  varchar, 
  text, 
  timestamp, 
  int, 
  primaryKey 
} from 'drizzle-orm/mysql-core';
import { relations, sql } from 'drizzle-orm';

// --- 共通のタイムスタンプヘルパー ---
export const baseTimestampColumns = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
};