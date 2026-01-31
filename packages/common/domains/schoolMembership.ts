import { uuidv7 } from "uuidv7";

export interface SchoolMembership {
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

export const createSchoolMembershipEntity = (
	accountId: string,
	schoolId: string,
): SchoolMembership => {
	const now = new Date();
	return {
		id: uuidv7(),
		accountId,
		schoolId,
		createdAt: now,
		updatedAt: now,
	};
};
