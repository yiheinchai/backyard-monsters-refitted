import { SmartFox } from "../../SmartFox";
import { User } from "../User";

/**
 * IUserManager - Interface for user management.
 */
export interface IUserManager {
    readonly userCount: number;
    readonly smartFox: SmartFox;
    containsUserName(name: string): boolean;
    containsUserId(id: number): boolean;
    containsUser(user: User): boolean;
    getUserByName(name: string): User | null;
    getUserById(id: number): User | null;
    addUser(user: User): void;
    removeUser(user: User): void;
    removeUserById(id: number): void;
    getUserList(): Array<User>;
}
