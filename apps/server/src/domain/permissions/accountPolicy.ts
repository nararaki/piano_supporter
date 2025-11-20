import { AccountRole } from "../../../../packages/domain/src/index.ts";
import { permissionsByRole, Permission } from "./permission.ts";
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
        