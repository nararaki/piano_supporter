import type { Practice } from "@piano_supporter/common/domains/practice.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";

export interface PracticeRepository {
	findById(id: string): Promise<Result<Practice>>;
	findByRelationId(relationId: string): Promise<Result<Practice[]>>;
	create(data: Practice,relationId: string): Promise<Result<Practice>>;
}

