import { 
  mysqlTable, 
  varchar, 
  text, 
} from 'drizzle-orm/mysql-core';
import { post } from './post.ts';
import { account } from './account.ts';
import { baseTimestampColumns } from './time.ts';

export const comment = mysqlTable('comment', {
  id: varchar('id', { length: 255 }).primaryKey(),
  postId: varchar('post_id', { length: 255 }).notNull().references(() => post.id),
  accountId: varchar('account_id', { length: 255 }).notNull().references(() => account.id),
  parentCommentId: varchar('parent_comment_id', { length: 255 }).references(():any => comment.id),
  content: text('content').notNull(),
  ...baseTimestampColumns,	
});