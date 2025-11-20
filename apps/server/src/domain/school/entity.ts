import { uuidv7 } from "uuidv7";
import type { SchoolCreateData } from "@piano_supporter/common/domains/index.ts";

export const createSchoolEntity = (data:SchoolCreateData)=>{
    const newSchoolData = {
        name: data.name,
        location: data.location,
        email:data.email,
        shareCode: uuidv7()
    }
    return newSchoolData;
}