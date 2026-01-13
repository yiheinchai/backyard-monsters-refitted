import { SmartFox } from "../../SmartFox";
import { SFSValidationError } from "../../exceptions/SFSValidationError";
import { BaseRequest } from "../BaseRequest";

/**
 * InitBuddyListRequest - Request to initialize buddy list.
 */
export class InitBuddyListRequest extends BaseRequest {
    public static readonly KEY_BLIST: string = "bl";
    public static readonly KEY_BUDDY_STATES: string = "bs";
    public static readonly KEY_MY_VARS: string = "mv";

    constructor() {
        super(BaseRequest.InitBuddyList);
    }

    public override validate(sfs: SmartFox): void {
        const errors: Array<string> = [];
        if (sfs.buddyManager.isInited) {
            errors.push("Buddy List is already initialized.");
        }
        if (errors.length > 0) {
            throw new SFSValidationError("InitBuddyRequest error", errors);
        }
    }

    public override execute(sfs: SmartFox): void {
        // No execution logic
    }
}
