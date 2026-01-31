import { relations, sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/mysql-core";

// --- 共通のタイムスタンプヘルパー ---
export const baseTimestampColumns = {
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
};
