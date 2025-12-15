import { createSchool as createSchoolApi } from "@/infrastructure/api/school";
import type { createServerSchool } from "@piano_supporter/common/domains/school.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { schoolCreateData } from "@piano_supporter/common/commonResponseType/honoResponse.ts";

export const createSchool = async(
	data: schoolCreateData,
): Promise<Result<createServerSchool>> => {
	return await createSchoolApi(data);
};

