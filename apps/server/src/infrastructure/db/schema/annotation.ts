import { 
  mysqlTable, 
  varchar, 
  text, 
  int,
} from 'drizzle-orm/mysql-core';
import { baseTimestampColumns } from './time.ts';
import { practice } from './practice.ts';
import { task } from './task.ts';

export const annotation = mysqlTable('annotation', {
  id: varchar('id', { length: 255 }).primaryKey(),
  practiceId: varchar('practice_id', { length: 255 }).notNull().references(() => practice.id),
  content: text('content'),
  taskId: varchar('task_id', { length: 255 }).references(() => task.id,{onDelete: 'set null' }),
  sectionNumber: int('section_number'),
  timePosition: int('time_position'),
  positionX: int('position_x'),
  positionY: int('position_y'),
  ...baseTimestampColumns,
});