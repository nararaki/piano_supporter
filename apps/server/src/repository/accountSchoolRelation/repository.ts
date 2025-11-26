import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { SchoolAccountRelation } from "@piano_supporter/common/domains/schoolAccountRelation.ts";

export interface accountSchoolRelationRepository {
	create(accountId: string, schoolId: string): Promise<Result<SchoolAccountRelation>>;
	findByAccountId(accountId: string): Promise<Result<SchoolAccountRelation[]>>;
}