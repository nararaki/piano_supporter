import { db } from "../../../infrastructure/db/initial.ts";
import { roles } from "../../../infrastructure/db/schema/role.ts";
import { ROLE_NAMES } from "@piano_supporter/common/domains/role.ts";
import { eq } from "drizzle-orm";
import { uuidv7 } from "uuidv7";

/**
 * ロールのseedデータをデータベースに挿入
 * 既に存在する場合はスキップ
 */
export const seedRoles = async (): Promise<void> => {
	const roleNames = [ROLE_NAMES.ADMIN, ROLE_NAMES.TEACHER, ROLE_NAMES.STUDENT];

	for (const roleName of roleNames) {
		// 既に存在するか確認
		const [existingRole] = await db
			.select()
			.from(roles)
			.where(eq(roles.name, roleName))
			.limit(1)
			.execute();

		if (existingRole) {
			console.log(`ロール "${roleName}" は既に存在するためスキップします`);
			continue;
		}

		// ロールを挿入
		const roleId = uuidv7();
		const now = new Date();
		await db.insert(roles).values({
			id: roleId,
			name: roleName,
			createdAt: now,
			updatedAt: now,
		});

		console.log(`ロール "${roleName}" (ID: ${roleId}) を挿入しました`);
	}

	console.log("ロールのseedデータの挿入が完了しました");
};

