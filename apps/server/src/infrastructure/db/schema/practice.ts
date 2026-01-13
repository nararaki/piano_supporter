import { 
  mysqlTable, 
  varchar,
  foreignKey,
  int,
} from 'drizzle-orm/mysql-core';
import { baseTimestampColumns } from './time.ts';
import { music } from './music.ts';
import { accountSchoolRelation } from './index.ts';

export const practice = mysqlTable('practice', {
  id: varchar('id', { length: 255 }).primaryKey(),
  accountSchoolRelationId: varchar('account_school_relation_id', { length: 255 }).notNull(),
  musicId: int('music_id').notNull().references(() => music.id),
  sheetMusicUrl: varchar('sheet_music_url', { length: 512 }).notNull(),
  ...baseTimestampColumns,
}, (table) => {
  return {
    practiceAccountSchoolRelationFk: foreignKey({
      columns: [table.accountSchoolRelationId],
      foreignColumns: [accountSchoolRelation.id],
      name: 'p_asr_id_fk',
    }).onUpdate('no action'),
    practiceMusicFk: foreignKey({
      columns: [table.musicId],
      foreignColumns: [music.id],
      name: 'p_music_id_fk',
    }).onUpdate('no action'),
  };
});