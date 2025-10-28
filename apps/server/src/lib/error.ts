export type Result<T> = { ok:true; value:T} | { ok:false; error:AppError;};

export type AppError = 
    {type:"AccountValidaterError"; message:"ユーザー認証をしてください";} | 
    {type:"OrgValidaterError"; message:"教室に所属していません";} |
    {type:"FILE_UPLOAD_ERROR"; message:string;} |
    {type:"FILE_CONVERSION_ERROR"; message:string;};

export function ok<T> (value:T):Result<T>{
    return {ok:true,value};
}

export function err<T> (error:AppError):Result<T>{
    return {ok:false,error};
}