import { AccountCreateData } from "../../../../packages/types/src/index.ts";
export type AccountRole = 'teacher' | 'student' | 'admin';

export const createAccountEntity = (userId:string,lastName:string,firstName:string,email:string):AccountCreateData=>{
    return {
        id:userId,
        lastName:lastName,
        firstName:firstName,
        email:email,
        profileImage:null,
    }
}