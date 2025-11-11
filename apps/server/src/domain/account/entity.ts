import { createServerAccount } from "../../../../packages/domain/src/index.ts";

export const createAccountEntity = (userId:string,lastName:string,firstName:string,email:string):createServerAccount=>{
    return {
        id:userId,
        lastName:lastName,
        firstName:firstName,
        email:email,
        profileImage:null,
    }
}