import { AccountRole } from "../account/entity.ts";
export type Membership = {
    organizationId: string;
    accountId: string;
    role: AccountRole;
}
