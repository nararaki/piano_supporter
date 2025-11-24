import { client } from "@/lib/apiClient";
import { ok } from "@piano_supporter/common/lib/error.ts";
import type { schoolCreateData } from "@piano_supporter/common/commonResponseType/honoResponse.ts";

export const createSchool = async(data:schoolCreateData)=>{
    const rawResult = await client['school-init'].$post({
        json: data
    });
    const response = await rawResult.json();
    if(!rawResult.ok){
        return response;
    }
    return ok(response);
}
