import { SmartFox } from "../../SmartFox";
import { SFSValidationError } from "../../exceptions/SFSValidationError";
import { BaseRequest } from "../BaseRequest";

/**
 * RemoveBuddyRequest - Request to remove a buddy from list.
 */
export class RemoveBuddyRequest extends BaseRequest {
    public static readonly KEY_BUDDY_NAME: string = "bn";

    private _name: string;

    constructor(buddyName: string) {
        super(BaseRequest.RemoveBuddy);
        this._name = buddyName;
    }

    public override validate(sfs: SmartFox): void {
        const errors: Array<string> = [];
        if (!sfs.buddyManager.isInited) {
            errors.push("BuddyList is not inited. Please send an InitBuddyRequest first.");
        }
        if (sfs.buddyManager.myOnlineState === false) {
            errors.push("Can't remove buddy while off-line");
        }
        if (!sfs.buddyManager.containsBuddy(this._name)) {
            errors.push("Can't remove buddy, it's not in your list: " + this._name);
        }
        if (errors.length > 0) {
            throw new SFSValidationError("BuddyList request error", errors);
        }
    }

    public override execute(sfs: SmartFox): void {
        this._sfso.putUtfString(RemoveBuddyRequest.KEY_BUDDY_NAME, this._name);
    }
}
