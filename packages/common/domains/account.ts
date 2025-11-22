export type AccountRole = "teacher" | "student" | "admin";

export interface Account {
	id: string; //clerkIdを使う
	firstName: string;
	lastName: string;
	email: string;
	profileImage: string | null;
	createdAt: Date;
	updatedAt: Date | null;
}

export type createServerAccount = Omit<Account, "createdAt" | "updatedAt">;

/**
 * アカウントエンティティを作成
 */
export const createAccountEntity = (
	userId: string,
	lastName: string,
	firstName: string,
	email: string,
): createServerAccount => {
	return {
		id: userId,
		lastName: lastName,
		firstName: firstName,
		email: email,
		profileImage: null,
	};
};

