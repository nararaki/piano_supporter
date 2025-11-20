import type { SchoolCreateData } from "@piano_supporter/common/domains/index.ts";
import { uuidv7 } from "uuidv7";

export const createSchoolEntity = (data: SchoolCreateData) => {
	const newSchoolData = {
		name: data.name,
		location: data.location,
		email: data.email,
		shareCode: uuidv7(),
	};
	return newSchoolData;
};
