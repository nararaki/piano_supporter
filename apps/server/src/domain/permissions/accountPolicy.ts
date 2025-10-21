import { AccountRole } from "../account/entity";
import { permissionsByRole, Permission } from "./permission";
export class AccountPolicy {
    private permissions: Permission[];
 constructor(
    public role: AccountRole,
 ){
    this.permissions = permissionsByRole[role] || [];
 }

    public can(permission:Permission):boolean{
        return this.permissions.includes(permission);
    }
}
        