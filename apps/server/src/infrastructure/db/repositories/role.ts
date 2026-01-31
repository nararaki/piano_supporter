import type { Role } from "@piano_supporter/common/domains/role.ts";
import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import { eq } from "drizzle-orm";
import type { roleRepository } from "../../../repository/role/repository.ts";
import { db } from "../initial.ts";
import { roles } from "../schema/role.ts";

class RoleRepositoryClient implements roleRepository {
	async findByName(name: string): Promise<Result<Role>> {
		try {
			const [result] = await db
				.select()
				.from(roles)
				.where(eq(roles.name, name))
				.limit(1)
				.execute();

			if (!result) {
				return err({
					type: "NOT_FOUND",
					message: `ロール "${name}" が見つかりません`,
				});
			}

			return ok({
				id: result.id,
				name: result.name,
				createdAt: result.createdAt,
				updatedAt: result.updatedAt,
			});
		} catch (e) {
			console.log("ロールの取得に失敗しました", e);
			return err({
				type: "UNEXPECTED",
				message: "ロールの取得に失敗しました",
			});
		}
	}

	async findById(id: string): Promise<Result<Role>> {
		try {
			const [result] = await db
				.select()
				.from(roles)
				.where(eq(roles.id, id))
				.limit(1)
				.execute();

			if (!result) {
				return err({
					type: "NOT_FOUND",
					message: `ロールID "${id}" が見つかりません`,
				});
			}

			return ok({
				id: result.id,
				name: result.name,
				createdAt: result.createdAt,
				updatedAt: result.updatedAt,
			});
		} catch (e) {
			console.log("ロールの取得に失敗しました", e);
			return err({
				type: "UNEXPECTED",
				message: "ロールの取得に失敗しました",
			});
		}
	}
}

export const newRoleRepositoryClient = new RoleRepositoryClient();
