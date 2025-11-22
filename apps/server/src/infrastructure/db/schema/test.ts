import { 
  mysqlTable, 
  varchar, 
  text, 
  timestamp, 
  int, 
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// --- 共通のタイムスタンプヘルパー ---
const baseTimestampColumns = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
};

// ==========================================
// 1. Auth & School Domain
// ==========================================

export const account = mysqlTable('account', {
  // ClerkのUser IDを格納
  id: varchar('id', { length: 255 }).primaryKey(),
  lastName: varchar("last_name", { length: 36 }).notNull(),
  firstName: varchar("first_name", { length: 36 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  profileImage: varchar("profile_url", { length: 100 }),
  ...baseTimestampColumns,
});

export const school = mysqlTable('school', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: varchar('address', { length: 255 }),
  phoneNumber: varchar('phone_number', { length: 50 }),
  ...baseTimestampColumns,
});

export const role = mysqlTable('role', {
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
export const accountRole = mysqlTable('account_role', {
  id: varchar('id', { length: 255 }).primaryKey(),
  accountSchoolRelationId: varchar('account_school_relation_id', { length: 255 })
    .notNull()
    .references(() => accountSchoolRelation.id, { onDelete: 'cascade' }),
  roleId: varchar('role_id', { length: 255 }).notNull().references(() => role.id),
  ...baseTimestampColumns,
});

// ==========================================
// 2. Music & Practice Domain
// ==========================================

export const composer = mysqlTable('composer', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  ...baseTimestampColumns,
});

export const arranger = mysqlTable('arranger', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  ...baseTimestampColumns,
});

export const music = mysqlTable('music', {
  id: varchar('id', { length: 255 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  composerId: varchar('composer_id', { length: 255 }).notNull().references(() => composer.id),
  arrangerId: varchar('arranger_id', { length: 255 }).notNull().references(() => arranger.id),
  sheetMusicUrl: varchar('sheet_music_url', { length: 512 }),
  ...baseTimestampColumns,
});

export const practice = mysqlTable('practice', {
  id: varchar('id', { length: 255 }).primaryKey(),
  accountId: varchar('account_id', { length: 255 }).notNull().references(() => account.id, { onDelete: 'cascade' }),
  musicId: varchar('music_id', { length: 255 }).notNull().references(() => music.id),
  ...baseTimestampColumns,
});

export const status = mysqlTable('status', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  ...baseTimestampColumns,
});

export const task = mysqlTable('task', {
  id: varchar('id', { length: 255 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  statusId: varchar('status_id', { length: 255 }).notNull().references(() => status.id),
  practiceId: varchar('practice_id', { length: 255 }).notNull().references(() => practice.id, { onDelete: 'cascade' }),
  ...baseTimestampColumns,
});

export const annotation = mysqlTable('annotation', {
  id: varchar('id', { length: 255 }).primaryKey(),
  practiceId: varchar('practice_id', { length: 255 }).notNull().references(() => practice.id, { onDelete: 'cascade' }),
  content: text('content'),
  taskId: varchar('task_id', { length: 255 }).references(() => task.id, { onDelete: 'set null' }),
  sectionNumber: int('section_number'),
  timePosition: int('time_position'),
  positionX: int('position_x'),
  positionY: int('position_y'),
  ...baseTimestampColumns,
});

// ==========================================
// 3. SNS Domain
// ==========================================

export const post = mysqlTable('post', {
  id: varchar('id', { length: 255 }).primaryKey(),
  accountId: varchar('account_id', { length: 255 }).notNull().references(() => account.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }),
  content: text('content'),
  ...baseTimestampColumns,
});

export const video = mysqlTable('video', {
  id: varchar('id', { length: 255 }).primaryKey(),
  postId: varchar('post_id', { length: 255 }).notNull().references(() => post.id, { onDelete: 'cascade' }),
  url: varchar('url', { length: 512 }).notNull(),
  type: varchar('type', { length: 50 }),
  ...baseTimestampColumns,
});

export const comment = mysqlTable('comment', {
  id: varchar('id', { length: 255 }).primaryKey(),
  postId: varchar('post_id', { length: 255 }).notNull().references(() => post.id, { onDelete: 'cascade' }),
  accountId: varchar('account_id', { length: 255 }).notNull().references(() => account.id, { onDelete: 'cascade' }),
  parentCommentId: varchar('parent_comment_id', { length: 255 }).references((): any => comment.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  ...baseTimestampColumns,
});

export const postLike = mysqlTable('post_like', {
  id: varchar('id', { length: 255 }).primaryKey(),
  postId: varchar('post_id', { length: 255 }).notNull().references(() => post.id, { onDelete: 'cascade' }),
  accountId: varchar('account_id', { length: 255 }).notNull().references(() => account.id, { onDelete: 'cascade' }),
  ...baseTimestampColumns,
});

export const commentLike = mysqlTable('comment_like', {
  id: varchar('id', { length: 255 }).primaryKey(),
  commentId: varchar('comment_id', { length: 255 }).notNull().references(() => comment.id, { onDelete: 'cascade' }),
  accountId: varchar('account_id', { length: 255 }).notNull().references(() => account.id, { onDelete: 'cascade' }),
  ...baseTimestampColumns,
});

// ==========================================
// Relations Definitions
// ==========================================
// ※ Relationsのキー名（posts, comments等）は「複数のデータを持つ」ことを表すため
// 一般的に複数形のままにしますが、参照する変数は単数形（post, comment）になっています。

export const accountRelations = relations(account, ({ many }) => ({
  schoolRelations: many(accountSchoolRelation),
  practices: many(practice),
  posts: many(post),
  comments: many(comment),
  postLikes: many(postLike),
}));

export const schoolRelations = relations(school, ({ many }) => ({
  accountRelations: many(accountSchoolRelation),
}));

export const postRelations = relations(post, ({ one, many }) => ({
  account: one(account, { fields: [post.accountId], references: [account.id] }),
  videos: many(video),
  comments: many(comment),
  likes: many(postLike),
}));

export const commentRelations = relations(comment, ({ one, many }) => ({
  post: one(post, { fields: [comment.postId], references: [post.id] }),
  author: one(account, { fields: [comment.accountId], references: [account.id] }),
  parent: one(comment, { fields: [comment.parentCommentId], references: [comment.id] }),
  replies: many(comment, { relationName: 'replies' }),
  likes: many(commentLike),
}));