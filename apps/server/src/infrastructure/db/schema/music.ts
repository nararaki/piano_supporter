import { 
  mysqlTable, 
  varchar, 
} from 'drizzle-orm/mysql-core';
import { baseTimestampColumns } from './time.ts';
import { composer,arranger } from './composer.ts';

export const music = mysqlTable('music', {
  id: varchar('id', { length: 255 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  composerId: varchar('composer_id', { length: 255 }).notNull().references(() => composer.id),
  arrangerId: varchar('arranger_id', { length: 255 }).notNull().references(() => arranger.id),
  sheetMusicUrl: varchar('sheet_music_url', { length: 512 }),
  ...baseTimestampColumns,
});
