import type { Membership } from "./entity.ts";
export interface MembershipRepository {
    findByAccountIdAndOrganizationId(accountId:string, organizationId:string) : Promise<Membership | null>;
    findByAccountId(accountId:string):Promise<Membership>;
    findByOrganizationId(organizationId:string):Promise<Membership>;
    updateMembership(membership:Membership) : Promise<void>;
}