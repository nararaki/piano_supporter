import { Result } from "../../lib/error.ts";

export interface IFileGetter{
    getFile(url:string):Promise<Result<ArrayBuffer>>;
}