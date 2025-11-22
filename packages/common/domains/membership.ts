import type { AccountRole } from "./account";

export type Membership = {
	organizationId: string;
	accountId: string;
	role: AccountRole;
};

