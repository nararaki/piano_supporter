import type { User } from "./entity.ts";
export interface UserRepository {
	findById(id: string): Promise<User | null>;
}
