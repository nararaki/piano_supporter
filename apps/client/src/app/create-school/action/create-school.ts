import type { SchoolCreateData } from "@piano_supporter/common/domains/index";
import { client } from "@/lib/apiClient";
import { ok } from "@piano_supporter/common/lib/error";
import type { createServerSchool } from "@piano_supporter/common/domains/index.ts";

export const createSchool = async(data:SchoolCreateData)=>{
    const rawResult = await client['school-init'].$post({
        json: data
    });
    const response = await rawResult.json() as createServerSchool;
    return ok(response);
}