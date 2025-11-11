import { uuidv7 } from "uuidv7";
import { SchoolCreateData } from "../../../../packages/domain/src/index.ts";
export interface School {
    id: number;
    name: string;
    location: string;
    email: string;
}

export const createSchoolEntity = (data:SchoolCreateData)=>{
    const newSchoolData = {
        name: data.name,
        location: data.location,
        email:data.email,
        shareCode: uuidv7()
    }
    return newSchoolData;
}