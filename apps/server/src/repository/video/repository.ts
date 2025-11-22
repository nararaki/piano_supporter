import type { VideoEntity } from "@piano_supporter/common/domains/video.ts";

export interface VideoRepository {
	findById(id: number): Promise<VideoEntity>;
}
