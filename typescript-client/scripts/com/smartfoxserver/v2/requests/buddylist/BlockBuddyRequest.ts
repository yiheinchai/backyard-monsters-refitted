import { SmartFox } from "../../SmartFox";
import { Buddy } from "../../entities/Buddy";
import { SFSValidationError } from "../../exceptions/SFSValidationError";
import { BaseRequest } from "../BaseRequest";

/**
 * BlockBuddyRequest - Request to block/unblock a buddy.
 */
export class BlockBuddyRequest extends BaseRequest {
    public static readonly KEY_BUDDY_NAME: string = "bn";
    public static readonly KEY_BUDDY_BLOCK_STATE: string = "bs";

    private _buddyName: string;
    private _blocked: boolean;

    constructor(buddyName: string, blocked: boolean) {
        super(BaseRequest.BlockBuddy);
        this._buddyName = buddyName;
        this._blocked = blocked;
    }

    public override validate(sfs: SmartFox): void {
        const errors: Array<string> = [];
        if (!sfs.buddyManager.isInited) {
            errors.push("BuddyList is not inited. Please send an InitBuddyRequest first.");
        }
        if (this._buddyName === null || this._buddyName.length < 1) {
            errors.push("Invalid buddy name: " + this._buddyName);
        }
        if (sfs.buddyManager.myOnlineState === false) {
            errors.push("Can't block buddy while off-line");
        }
        const buddy: Buddy | null = sfs.buddyManager.getBuddyByName(this._buddyName);
        if (buddy === null) {
            errors.push("Can't block buddy, it's not in your list: " + this._buddyName);
        } else if (buddy.isBlocked === this._blocked) {
            errors.push("BuddyBlock flag is already in the requested state: " + this._blocked + ", for buddy: " + buddy);
        }
        if (errors.length > 0) {
            throw new SFSValidationError("BuddyList request error", errors);
        }
    }

    public override execute(sfs: SmartFox): void {
        this._sfso.putUtfString(BlockBuddyRequest.KEY_BUDDY_NAME, this._buddyName);
        this._sfso.putBool(BlockBuddyRequest.KEY_BUDDY_BLOCK_STATE, this._blocked);
    }
}
