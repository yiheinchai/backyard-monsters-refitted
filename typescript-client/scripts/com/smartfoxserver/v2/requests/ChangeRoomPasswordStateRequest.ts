import { SmartFox } from "../SmartFox";
import { Room } from "../entities/Room";
import { SFSValidationError } from "../exceptions/SFSValidationError";
import { BaseRequest } from "./BaseRequest";

/**
 * ChangeRoomPasswordStateRequest - Request to change a room's password.
 */
export class ChangeRoomPasswordStateRequest extends BaseRequest {
    public static readonly KEY_ROOM: string = "r";
    public static readonly KEY_PASS: string = "p";

    private _room: Room;
    private _newPass: string;

    constructor(room: Room, newPassword: string) {
        super(BaseRequest.ChangeRoomPassword);
        this._room = room;
        this._newPass = newPassword;
    }

    public override validate(sfs: SmartFox): void {
        const errors: Array<string> = [];
        if (this._room === null) {
            errors.push("Provided room is null");
        }
        if (this._newPass === null) {
            errors.push("Invalid new room password. It must be a non-null string.");
        }
        if (errors.length > 0) {
            throw new SFSValidationError("ChangePassState request error", errors);
        }
    }

    public override execute(sfs: SmartFox): void {
        this._sfso.putInt(ChangeRoomPasswordStateRequest.KEY_ROOM, this._room.id);
        this._sfso.putUtfString(ChangeRoomPasswordStateRequest.KEY_PASS, this._newPass);
    }
}
