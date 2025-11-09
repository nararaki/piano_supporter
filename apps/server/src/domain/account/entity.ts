export type AccountRole = 'teacher' | 'student' | 'admin';

export interface Account {
    id: string;  //clerkIdを使う
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export const createAccountEntity = (userId:string,lastName:string,firstName:string,email:string):Account=>{
    return {
        id:userId,
        lastName:lastName,
        firstName:firstName,
        email:email,
        profileImage:null,
        createdAt:null,
        updatedAt:null,
    }
}