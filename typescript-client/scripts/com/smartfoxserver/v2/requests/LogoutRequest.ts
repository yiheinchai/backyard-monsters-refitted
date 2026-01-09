import { SmartFox } from "../SmartFox";
import { SFSValidationError } from "../exceptions/SFSValidationError";
import { BaseRequest } from "./BaseRequest";

/**
 * LogoutRequest - Request for logging out from current zone.
 */
export class LogoutRequest extends BaseRequest {
    public static readonly KEY_ZONE_NAME: string = "zn";

    constructor() {
        super(BaseRequest.Logout);
    }

    public override validate(sfs: SmartFox): void {
        if (sfs.mySelf === null) {
            throw new SFSValidationError("LogoutRequest Error", ["You are not logged in a the moment!"]);
        }
    }
}
