import { uuidv7 } from "uuidv7";

export interface School {
	id: string;
	name: string;
	email: string;
	location: string;
	shareCode: string;
	createdAt: Date;
	updatedAt: Date;
}

export type SchoolCreateData = Omit<
	School,
	"id" | "createdAt" | "updatedAt" | "shareCode"
>;

export const createSchoolEntity = (data: SchoolCreateData): School => {
	const now = new Date();
	return {
		id: uuidv7(),
		name: data.name,
		location: data.location,
		email: data.email,
		shareCode: uuidv7(),
		createdAt: now,
		updatedAt: now,
	};
};
