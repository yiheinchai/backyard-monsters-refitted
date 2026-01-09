import { SmartFox } from "../../SmartFox";
import { SFSValidationError } from "../../exceptions/SFSValidationError";
import { BaseRequest } from "../BaseRequest";

/**
 * GoOnlineRequest - Request to set online status for buddy list.
 */
export class GoOnlineRequest extends BaseRequest {
    public static readonly KEY_ONLINE: string = "o";
    public static readonly KEY_BUDDY_NAME: string = "bn";
    public static readonly KEY_BUDDY_ID: string = "bi";

    private _online: boolean;

    constructor(online: boolean) {
        super(BaseRequest.GoOnline);
        this._online = online;
    }

    public override validate(sfs: SmartFox): void {
        const errors: Array<string> = [];
        if (!sfs.buddyManager.isInited) {
            errors.push("BuddyList is not inited. Please send an InitBuddyRequest first.");
        }
        if (errors.length > 0) {
            throw new SFSValidationError("GoOnline request error", errors);
        }
    }

    public override execute(sfs: SmartFox): void {
        sfs.buddyManager.setMyOnlineState(this._online);
        this._sfso.putBool(GoOnlineRequest.KEY_ONLINE, this._online);
    }
}
