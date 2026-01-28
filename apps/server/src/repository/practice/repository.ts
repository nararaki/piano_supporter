import type { Music } from "@piano_supporter/common/domains/music.ts";
import type { SchoolMembership } from "@piano_supporter/common/domains/schoolMembership.ts";
import type { Practice } from "@piano_supporter/common/domains/practice.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export interface PracticeRepository {
	findById(id: string): Promise<Result<Practice>>;
	findByRelationId(relationId: string): Promise<Result<Practice[]>>;
	create(data: Practice, membership: SchoolMembership, musicData: Music): Promise<Result<Practice>>;
}
