import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { SchoolMembership } from "@piano_supporter/common/domains/schoolMembership.ts";

export interface SchoolMembershipRepository {
	create(membership: SchoolMembership): Promise<Result<SchoolMembership>>;
	findByAccountId(accountId: string): Promise<Result<SchoolMembership[]>>;
	findByAccountIdAndSchoolId(accountId: string, schoolId: string): Promise<Result<SchoolMembership>>;
}
