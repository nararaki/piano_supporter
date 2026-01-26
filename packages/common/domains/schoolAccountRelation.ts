import { uuidv7 } from "uuidv7";

export interface SchoolAccountRelation {
	id: string;
	accountId: string;
	schoolId: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface EnrollAccountToSchoolData {
	accountId: string;
	schoolId: string;
}

export const createSchoolAccountRelationEntity = (
	accountId: string,
	schoolId: string,
): SchoolAccountRelation => {
	const now = new Date();
	return {
		id: uuidv7(),
		accountId,
		schoolId,
		createdAt: now,
		updatedAt: now,
	};
};
