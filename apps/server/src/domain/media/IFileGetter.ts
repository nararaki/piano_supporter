import type { Result } from "../../../../packages/lib/src/error.ts";

export interface IFileGetter {
	getFile(url: string): Promise<Result<ArrayBuffer>>;
}
