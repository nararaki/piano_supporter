import type { RoleName } from "@piano_supporter/common/domains/role.ts";

export enum Permission {
	canDoComment = "canDoComment",
	canDeleteUser = "canDeleteUser",
	canInviteUser = "canInviteUser",
	canDoPost = "canDoPost",
}

export const teacherPermission: Permission[] = [Permission.canDoComment];

export const adminPermissions: Permission[] = [
	...teacherPermission,
	Permission.canDeleteUser,
	Permission.canInviteUser,
];

export const studentPermissions: Permission[] = [Permission.canDoPost];

export const permissionsByRole: Record<RoleName, Permission[]> = {
	admin: adminPermissions,
	teacher: teacherPermission,
	student: studentPermissions,
};
