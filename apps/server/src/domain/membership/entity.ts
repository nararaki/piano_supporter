import type { AccountRole } from "@piano_supporter/common/domains/index.ts";
export type Membership = {
	organizationId: string;
	accountId: string;
	role: AccountRole;
};
