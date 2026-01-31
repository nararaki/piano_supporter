import { foreignKey, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { account } from "./account.ts";
import { school } from "./school.ts";
import { baseTimestampColumns } from "./time.ts";

export const roles = mysqlTable("role", {
	id: varchar("id", { length: 255 }).primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	...baseTimestampColumns,
});

// アカウントとスクールの中間テーブル
export const accountSchoolRelation = mysqlTable("account_school_relation", {
	id: varchar("id", { length: 255 }).primaryKey(),
	accountId: varchar("account_id", { length: 255 })
		.notNull()
		.references(() => account.id),
	schoolId: varchar("school_id", { length: 255 })
		.notNull()
		.references(() => school.id),
	...baseTimestampColumns,
});

// リレーション内の役割定義
export const accountRoles = mysqlTable(
	"account_role",
	{
		id: varchar("id", { length: 255 }).primaryKey(),
		accountSchoolRelationId: varchar("account_school_relation_id", {
			length: 255,
		}).notNull(),
		roleId: varchar("role_id", { length: 255 }).notNull(),
		...baseTimestampColumns,
	},
	(table) => {
		return {
			accountSchoolRelationFk: foreignKey({
				columns: [table.accountSchoolRelationId],
				foreignColumns: [accountSchoolRelation.id],
				name: "ar_asr_id_fk",
			}).onUpdate("no action"),
			roleFk: foreignKey({
				columns: [table.roleId],
				foreignColumns: [roles.id],
				name: "ar_role_id_fk",
			}).onUpdate("no action"),
		};
	},
);
