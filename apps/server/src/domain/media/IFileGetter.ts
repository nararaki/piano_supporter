import { Result } from "../../lib/error";

export interface IFileGetter{
    getFile(url:string):Promise<Result<ArrayBuffer>>;
}