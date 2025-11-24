import type { Result } from "@piano_supporter/common/lib/error.ts";

export interface IFileGetter {
	getFile(url: string): Promise<Result<ArrayBuffer>>;
}
