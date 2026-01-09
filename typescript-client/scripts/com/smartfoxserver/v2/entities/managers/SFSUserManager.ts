import { SmartFox } from "../../SmartFox";
import { User } from "../User";
import { Logger } from "../../logging/Logger";
import { IUserManager } from "./IUserManager";

/**
 * SFSUserManager - User management implementation.
 */
export class SFSUserManager implements IUserManager {
    private _usersByName: Map<string, User>;
    private _usersById: Map<number, User>;
    protected _log: Logger;
    protected _smartFox: SmartFox;

    constructor(sfs: SmartFox) {
        this._smartFox = sfs;
        this._log = Logger.getInstance();
        this._usersByName = new Map();
        this._usersById = new Map();
    }

    public containsUserName(name: string): boolean {
        return this._usersByName.has(name);
    }

    public containsUserId(id: number): boolean {
        return this._usersById.has(id);
    }

    public containsUser(user: User): boolean {
        return this._usersById.has(user.id);
    }

    public getUserByName(name: string): User | null {
        return this._usersByName.get(name) || null;
    }

    public getUserById(id: number): User | null {
        return this._usersById.get(id) || null;
    }

    public addUser(user: User): void {
        if (this._usersById.has(user.id)) {
            this._log.warn("Unexpected: duplicate user in UserManager: " + user);
        }
        this._addUser(user);
    }

    protected _addUser(user: User): void {
        this._usersByName.set(user.name, user);
        this._usersById.set(user.id, user);
    }

    public removeUser(user: User): void {
        this._usersByName.delete(user.name);
        this._usersById.delete(user.id);
    }

    public removeUserById(id: number): void {
        const user = this._usersById.get(id);
        if (user !== undefined) {
            this.removeUser(user);
        }
    }

    public get userCount(): number {
        return this._usersById.size;
    }

    public get smartFox(): SmartFox {
        return this._smartFox;
    }

    public getUserList(): Array<User> {
        const result: Array<User> = [];
        this._usersById.forEach((user) => {
            result.push(user);
        });
        return result;
    }

    public clearAll(): void {
        this._usersByName = new Map();
        this._usersById = new Map();
    }
}
