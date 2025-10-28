import {
  mysqlTable,
  varchar,
  int,
  text,
  timestamp, 
} from 'drizzle-orm/mysql-core';

export const posts = mysqlTable('posts', {
  id: int('id').autoincrement().primaryKey().notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(), 
  userId: varchar('user_id', { length: 36 }).notNull(), 
  videoUrl: int('video_id').notNull(),
  composerId: int('composer_id').notNull(), 
  createdAt: timestamp('created_at').notNull().defaultNow(),
});