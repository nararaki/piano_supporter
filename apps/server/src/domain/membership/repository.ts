import { Membership } from "./entity";
export interface MembershipRepository {
    findByAccountIdAndOrganizationId(accountId:string, organizationId:string) : Promise<Membership | null>;
    saveMembership(membership:Membership) : Promise<void>;
}