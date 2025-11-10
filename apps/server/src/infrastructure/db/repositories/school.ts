import { School } from "@root/src/domain/school/entity.ts";
import { schoolRepository } from "@root/src/domain/school/repository.ts";
import { err, Result,ok } from "../../../../../packages/lib/index.ts";
import { SchoolCreateData } from "../../../../../packages/types/src/index.ts";
import { db } from "../initial.ts";
import { schoolScheme } from "../schema/school.ts";
import { format } from "path";
import { eq } from "drizzle-orm";

class SchoolRepositoryClient implements schoolRepository{
    async createAccount(school: SchoolCreateData): Promise<Result<School>> {
        try{
            const result = await db
                .insert(schoolScheme)
                .values(school)
                .$returningId();
            return ok({
                id:result[0].id,
                ...school,
            });
        }catch(e){
            return err({
                type: 'CANNOT_CREATE_SCHOOL',
                message: "データベースエラー教室の作成に失敗しました"
            })
        }
    }

    async findById(id:number): Promise<Result<School>> {
        try{
            const [data] = await db 
                .select()
                .from(schoolScheme)
                .where(eq(schoolScheme.id,id))
                .limit(1)
                .execute();
            if(data){
                const result = data as School;
                return ok(result);
            }
            return err({
                type: 'CANNOT_FIND_SCHOOL',
                message: "教室が見つかりません"
            })
        }catch(e){
            return err({
                type: 'CANNOT_FIND_SCHOOL',
                message: "教室が見つかりません"
            })
        }
    }

    async findByShareCode(id:string): Promise<Result<School>> {
        try{
            const [data] = await db 
                .select()
                .from(schoolScheme)
                .where(eq(schoolScheme.shareCode,id))
                .limit(1)
                .execute();
            if(data){
                const result = data as School;
                return ok(result);
            }
            return err({
                type: 'CANNOT_FIND_SCHOOL',
                message: "教室が見つかりません"
            })
        }catch(e){
            return err({
                type: 'CANNOT_FIND_SCHOOL',
                message: "教室が見つかりません"
            })
        }
    }
}

export const newSchoolRepositoryClient = new SchoolRepositoryClient();