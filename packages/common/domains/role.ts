/**
 * ロール名の定数定義
 * 型安全にロール名を扱うため
 */
export const ROLE_NAMES = {
	ADMIN: "admin",
	TEACHER: "teacher",
	STUDENT: "student",
} as const;

export type RoleName = typeof ROLE_NAMES[keyof typeof ROLE_NAMES];

export interface Role {
	id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date | null;
}