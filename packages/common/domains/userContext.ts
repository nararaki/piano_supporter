import type { Account } from "./account";
import type { School } from "./school";

export interface UserContext {
	account: Account;
	school: School;
}

