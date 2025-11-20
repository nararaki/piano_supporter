import type { VideoEntity } from "./entity.ts";

export interface VideoRepository {
	findById(id: number): Promise<VideoEntity>;
}
