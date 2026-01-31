export interface Account {
	id: AccountId; //clerkIdを使う
	firstName: string;
	lastName: string;
	email: Email;
	profileImage: string | null;
	createdAt: Date;
	updatedAt: Date | null;
}

export type Email = Brand<string, "Email">;

export type AccountId = Brand<string, "AccountId">;

export const createAccountId = (id: string): AccountId => {
	return id as AccountId;
};

export const createEmail = (email: string): Email => {
	return email as Email;
};

export type createServerAccount = Omit<Account, "createdAt" | "updatedAt">;

/**
 * アカウントエンティティを作成
 */
export const createAccountEntity = (
	userId: AccountId,
	lastName: string,
	firstName: string,
	email: Email,
): createServerAccount => {
	return {
		id: userId,
		lastName: lastName,
		firstName: firstName,
		email: email,
		profileImage: null,
	};
};

