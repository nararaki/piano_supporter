import { datetime } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm'; // 💡 sqlヘルパーのインポート

export const baseTimestampColumns = {
  createdAt: datetime('created_at', { mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`) 
    .notNull(),
    
  updatedAt: datetime('updated_at', { mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`) 
    .$onUpdate(() => new Date()),
};