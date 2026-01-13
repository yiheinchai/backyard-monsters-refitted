import { SmartFox } from "../../SmartFox";
import { Buddy } from "../../entities/Buddy";
import { SFSValidationError } from "../../exceptions/SFSValidationError";
import { BaseRequest } from "../BaseRequest";

/**
 * AddBuddyRequest - Request to add a buddy to the buddy list.
 */
export class AddBuddyRequest extends BaseRequest {
    public static readonly KEY_BUDDY_NAME: string = "bn";

    private _name: string;

    constructor(buddyName: string) {
        super(BaseRequest.AddBuddy);
        this._name = buddyName;
    }

    public override validate(sfs: SmartFox): void {
        const errors: Array<string> = [];
        if (!sfs.buddyManager.isInited) {
            errors.push("BuddyList is not inited. Please send an InitBuddyRequest first.");
        }
        if (this._name === null || this._name.length < 1) {
            errors.push("Invalid buddy name: " + this._name);
        }
        if (sfs.buddyManager.myOnlineState === false) {
            errors.push("Can't add buddy while off-line");
        }
        const buddy: Buddy | null = sfs.buddyManager.getBuddyByName(this._name);
        if (buddy !== null && !buddy.isTemp) {
            errors.push("Can't add buddy, it is already in your list: " + this._name);
        }
        if (errors.length > 0) {
            throw new SFSValidationError("BuddyList request error", errors);
        }
    }

    public override execute(sfs: SmartFox): void {
        this._sfso.putUtfString(AddBuddyRequest.KEY_BUDDY_NAME, this._name);
    }
}
