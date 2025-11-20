// ---------------------------------
// School関連
// ---------------------------------

export interface School {
	id: string;
	name: string;
	email: string;
	location: string;
	shareCode: string;
	createdAt: Date;
	updatedAt: Date | null;
}

export type createServerSchool = Omit<School, "createdAt" | "updatedAt">;
export type createSchoolDatabase = Omit<
	School,
	"createdAt" | "updatedAt" | "id"
>;
export type SchoolCreateData = Omit<
	School,
	"id" | "createdAt" | "updatedAt" | "shareCode"
>;

// ---------------------------------
// Account関連
// ---------------------------------

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
