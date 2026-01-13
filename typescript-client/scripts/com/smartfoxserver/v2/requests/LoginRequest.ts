import ByteArray from "openfl/utils/ByteArray";
import { IHash } from "../../../hurlant/crypto/hash/IHash";
import { MD5 } from "../../../hurlant/crypto/hash/MD5";
import { Hex } from "../../../hurlant/util/Hex";
import { SmartFox } from "../SmartFox";
import { ISFSObject } from "../entities/data/ISFSObject";
import { SFSValidationError } from "../exceptions/SFSValidationError";
import { BaseRequest } from "./BaseRequest";

/**
 * LoginRequest - Request to log in to the server.
 */
export class LoginRequest extends BaseRequest {
    public static readonly KEY_ZONE_NAME: string = "zn";
    public static readonly KEY_USER_NAME: string = "un";
    public static readonly KEY_PASSWORD: string = "pw";
    public static readonly KEY_PARAMS: string = "p";
    public static readonly KEY_PRIVILEGE_ID: string = "pi";
    public static readonly KEY_ID: string = "id";
    public static readonly KEY_ROOMLIST: string = "rl";
    public static readonly KEY_RECONNECTION_SECONDS: string = "rs";

    private _zoneName: string;
    private _userName: string;
    private _password: string;
    private _params: ISFSObject | null;

    constructor(userName: string = "", password: string = "", zoneName: string = "", params: ISFSObject | null = null) {
        super(BaseRequest.Login);
        this._zoneName = zoneName;
        this._userName = userName;
        this._password = password === null ? "" : password;
        this._params = params;
    }

    public override execute(sfs: SmartFox): void {
        this._sfso.putUtfString(LoginRequest.KEY_ZONE_NAME, this._zoneName);
        this._sfso.putUtfString(LoginRequest.KEY_USER_NAME, this._userName);
        if (this._password.length > 0) {
            this._password = this.getMD5Hash(sfs.sessionToken + this._password);
        }
        this._sfso.putUtfString(LoginRequest.KEY_PASSWORD, this._password);
        if (this._params !== null) {
            this._sfso.putSFSObject(LoginRequest.KEY_PARAMS, this._params);
        }
    }

    public override validate(sfs: SmartFox): void {
        if (sfs.mySelf !== null) {
            throw new SFSValidationError("LoginRequest Error", ["You are already logged in. Logout first"]);
        }
        if ((this._zoneName === null || this._zoneName.length === 0) && sfs.config !== null) {
            this._zoneName = sfs.config.zone!;
        }
        if (this._zoneName === null || this._zoneName.length === 0) {
            throw new SFSValidationError("LoginRequest Error", ["Missing Zone name"]);
        }
    }

    private getMD5Hash(input: string): string {
        const hash: IHash = new MD5();
        const data: ByteArray = Hex.toArray(Hex.fromString(input));
        return Hex.fromArray(hash.hash(data));
    }
}
