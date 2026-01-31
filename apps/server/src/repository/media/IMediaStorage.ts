import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { Practice } from "@piano_supporter/common/domains/practice.ts";
import type { Music } from "@piano_supporter/common/domains/music.ts";

export interface IMediaStorage {
	createPracticeStorage(music: Music, practice: Practice): Promise<Result<string>>;
	getXmlData(cloudFrontUrl: string): Promise<Result<Buffer>>;
	put(key: string, content: Buffer, contentType: string): Promise<Result<void>>;
	getCloudFrontUrl(key: string): string;
	extractKeyFromUrl(cloudFrontUrl: string): string | null;
}
