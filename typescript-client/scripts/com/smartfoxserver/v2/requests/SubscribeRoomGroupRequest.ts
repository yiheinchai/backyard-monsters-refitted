import { SmartFox } from "../SmartFox";
import { SFSValidationError } from "../exceptions/SFSValidationError";
import { BaseRequest } from "./BaseRequest";

/**
 * SubscribeRoomGroupRequest - Request to subscribe to a room group.
 */
export class SubscribeRoomGroupRequest extends BaseRequest {
    public static readonly KEY_GROUP_ID: string = "g";
    public static readonly KEY_ROOM_LIST: string = "rl";

    private _groupId: string;

    constructor(groupId: string) {
        super(BaseRequest.SubscribeRoomGroup);
        this._groupId = groupId;
    }

    public override validate(sfs: SmartFox): void {
        const errors: Array<string> = [];
        if (this._groupId === null || this._groupId.length === 0) {
            errors.push("Invalid groupId. Must be a string with at least 1 character.");
        }
        if (errors.length > 0) {
            throw new SFSValidationError("SubscribeGroup request error", errors);
        }
    }

    public override execute(sfs: SmartFox): void {
        this._sfso.putUtfString(SubscribeRoomGroupRequest.KEY_GROUP_ID, this._groupId);
    }
}
