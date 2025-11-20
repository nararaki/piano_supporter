import { client } from "@/lib/apiClient";
import { ok } from "@piano_supporter/common/lib/error";
import type { SchoolCreateData } from "@piano_supporter/common/domains/index";
export const createSchool = async(data:SchoolCreateData)=>{
    const rawResult = await client['school-init'].$post({
        json: data
    });
    const response = await rawResult.json();
    if(!rawResult.ok){
        return response;
    }
    return ok(response);
}