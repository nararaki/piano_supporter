import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { Role } from "@piano_supporter/common/domains/role.ts";

export interface roleRepository {
	findByName(name: string): Promise<Result<Role>>;
	findById(id: string): Promise<Result<Role>>;
}

export interface accountRoleRepository {
	create(
		accountSchoolRelationId: string,
		roleId: string,
	): Promise<Result<{ id: string; accountSchoolRelationId: string; roleId: string }>>;
}
