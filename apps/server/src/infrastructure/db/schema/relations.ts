import { post } from './post.ts';
import { account } from './account.ts';
import { comment } from './comment.ts';
import { relations } from 'drizzle-orm';
import { accountSchoolRelation } from './role.ts';
import { school } from './school.ts';
import { practice } from './practice.ts';
import { postLike, commentLike } from './like.ts';
import { video } from './video.ts';

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