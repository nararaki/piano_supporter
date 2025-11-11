import { apiResponseHandler } from "@/lib/apiResponse";
import { createServerSchool, SchoolCreateData } from "../../../../../packages/domain/src";
import { client } from "@/lib/apiClient";
import { resumePluginState } from "next/dist/build/build-context";
import { err } from "../../../../../packages/lib";

export const createSchool = async(data:SchoolCreateData)=>{
    const rawResult = await client['school-init'].$post({
        json: data
    });
    const response = await rawResult.json();
    return response;
}