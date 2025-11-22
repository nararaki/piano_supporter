import { 
  mysqlTable, 
  varchar, 
  text, 
} from 'drizzle-orm/mysql-core';
import { post } from './post.ts';
import { account } from './account.ts';
import { baseTimestampColumns } from './time.ts';
import { comment } from './comment.ts';

export const postLike = mysqlTable('post_like', {
  id: varchar('id', { length: 255 }).primaryKey(),
  postId: varchar('post_id', { length: 255 }).notNull().references(() => post.id),
  accountId: varchar('account_id', { length: 255 }).notNull().references(() => account.id),
  ...baseTimestampColumns,
});

export const commentLike = mysqlTable('comment_like', {
  id: varchar('id', { length: 255 }).primaryKey(),
  commentId: varchar('comment_id', { length: 255 }).notNull().references(() => comment.id),
  accountId: varchar('account_id', { length: 255 }).notNull().references(() => account.id),
  ...baseTimestampColumns,
});