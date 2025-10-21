import { AccountRole } from "../account/entity";
export type Membership = {
    organizationId: string;
    accountId: string;
    role: AccountRole;
}
