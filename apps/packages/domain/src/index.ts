import { accountCreateData,schoolCreateData } from "../../../server/src/interface/schema";
// ---------------------------------
// School関連
// ---------------------------------


export interface School {
  id: number;
  name: string;
  email: string;
  location: string;
  shareCode: string;
  createdAt: Date;
  updatedAt: Date | null;
}


export type createServerSchool = Omit<School, 'createdAt' | 'updatedAt'>;
export type createSchoolDatabase = Omit<School,'createdAt' | 'updatedAt' | 'id'>

// ---------------------------------
// Account関連
// ---------------------------------

export type AccountRole = 'teacher' | 'student' | 'admin';

export interface Account {
  id: string; //clerkIdを使う
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export type createServerAccount = Omit<Account,'createdAt'|'updatedAt'>;
//interface層からの型共有,clientのリクエストの型
export type AccountCreateData = accountCreateData;
export type SchoolCreateData = schoolCreateData;