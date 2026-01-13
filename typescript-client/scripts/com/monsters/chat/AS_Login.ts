import { IAuthenticationSystem } from "./IAuthenticationSystem";
import { UserRecord } from "./UserRecord";

import { md5 } from "../../../md5";
import { SFSObject } from "../../smartfoxserver/v2/entities/data/SFSObject";

/**
 * ActionScript-based login authentication for SmartFox server.
 */
export class AS_Login implements IAuthenticationSystem {
    private user: UserRecord;
    private password: string | null = null;
    private params: SFSObject | null = null;
    private readonly SALT_SEED: string = "073c187f8a02f626210bbcb7f55a4cee";

    constructor(user: UserRecord) {
        this.user = user;
    }

    public authenticate(): boolean {
        const randomNum = Math.floor(Math.random() * 9999999);
        this.password = md5(this.SALT_SEED + this.user.Name + randomNum * (randomNum % 11));
        this.params = new SFSObject();
        this.params.putLong("hnumber", randomNum);
        this.params.putUtfString("pass", this.password);
        return true;
    }

    public get User(): UserRecord {
        return this.user;
    }

    public get Password(): string | null {
        return this.password;
    }

    public get Params(): SFSObject | null {
        return this.params;
    }
}
