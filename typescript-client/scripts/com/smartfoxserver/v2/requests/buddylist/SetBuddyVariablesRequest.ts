import { SmartFox } from "../../SmartFox";
import { ISFSArray } from "../../entities/data/ISFSArray";
import { SFSArray } from "../../entities/data/SFSArray";
import { BuddyVariable } from "../../entities/variables/BuddyVariable";
import { SFSValidationError } from "../../exceptions/SFSValidationError";
import { BaseRequest } from "../BaseRequest";

/**
 * SetBuddyVariablesRequest - Request to set buddy variables.
 */
export class SetBuddyVariablesRequest extends BaseRequest {
    public static readonly KEY_BUDDY_NAME: string = "bn";
    public static readonly KEY_BUDDY_VARS: string = "bv";

    private _buddyVariables: Array<BuddyVariable>;

    constructor(buddyVariables: Array<BuddyVariable>) {
        super(BaseRequest.SetBuddyVariables);
        this._buddyVariables = buddyVariables;
    }

    public override validate(sfs: SmartFox): void {
        const errors: Array<string> = [];
        if (!sfs.buddyManager.isInited) {
            errors.push("BuddyList is not inited. Please send an InitBuddyRequest first.");
        }
        if (sfs.buddyManager.myOnlineState === false) {
            errors.push("Can't set buddy variables while off-line");
        }
        if (this._buddyVariables === null || this._buddyVariables.length === 0) {
            errors.push("No variables were specified");
        }
        if (errors.length > 0) {
            throw new SFSValidationError("SetBuddyVariables request error", errors);
        }
    }

    public override execute(sfs: SmartFox): void {
        const varList: ISFSArray = new SFSArray();
        for (const bVar of this._buddyVariables) {
            varList.addSFSArray(bVar.toSFSArray());
        }
        this._sfso.putSFSArray(SetBuddyVariablesRequest.KEY_BUDDY_VARS, varList);
    }
}
