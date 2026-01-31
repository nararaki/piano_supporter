import type { RoleName } from "@piano_supporter/common/domains/role.ts";
import { type Permission, permissionsByRole } from "./permission.ts";
export class AccountPolicy {
	private permissions: Permission[];
	constructor(public role: RoleName) {
		this.permissions = permissionsByRole[role] || [];
	}

	public can(permission: Permission): boolean {
		return this.permissions.includes(permission);
	}
}
