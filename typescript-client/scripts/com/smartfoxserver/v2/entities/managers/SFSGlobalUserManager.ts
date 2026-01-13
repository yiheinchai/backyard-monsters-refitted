import { SmartFox } from "../../SmartFox";
import { User } from "../User";
import { SFSUserManager } from "./SFSUserManager";

/**
 * SFSGlobalUserManager - Global user manager with reference counting.
 */
export class SFSGlobalUserManager extends SFSUserManager {
    private _roomRefCount: Map<User, number>;

    constructor(sfs: SmartFox) {
        super(sfs);
        this._roomRefCount = new Map();
    }

    public override addUser(user: User): void {
        const count = this._roomRefCount.get(user);
        if (count === undefined) {
            super._addUser(user);
            this._roomRefCount.set(user, 1);
        } else {
            super._addUser(user);
            this._roomRefCount.set(user, count + 1);
        }
    }

    public override removeUser(user: User): void {
        if (this._roomRefCount !== null) {
            const count = this._roomRefCount.get(user);
            if (count === undefined || count < 1) {
                this._log.warn("GlobalUserManager RefCount is already at zero. User: " + user);
                return;
            }
            this._roomRefCount.set(user, count - 1);
            if (this._roomRefCount.get(user) === 0) {
                super.removeUser(user);
                this._roomRefCount.delete(user);
            }
        } else {
            this._log.warn("Can't remove User from GlobalUserManager. RefCount missing. User: " + user);
        }
    }

    private dumpRefCount(): void {
        // Debug method - no implementation needed
    }
}
