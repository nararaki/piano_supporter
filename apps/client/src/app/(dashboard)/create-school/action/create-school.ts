import { client } from "@/lib/apiClient";
import type { createServerSchool } from "@piano_supporter/common/domains/school.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { schoolCreateData } from "@piano_supporter/common/commonResponseType/honoResponse.ts";

export const createSchool = async(
	data: schoolCreateData,
): Promise<Result<createServerSchool>> => {
	const rawResult = await client['school-init'].$post({
		json: data,
	});
	const response = await rawResult.json() as Result<createServerSchool>;
	return response;
};
