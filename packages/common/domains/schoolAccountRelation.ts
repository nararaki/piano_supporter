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
