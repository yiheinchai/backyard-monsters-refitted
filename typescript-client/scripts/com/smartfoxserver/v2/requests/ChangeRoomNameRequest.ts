import { SmartFox } from "../SmartFox";
import { Room } from "../entities/Room";
import { SFSValidationError } from "../exceptions/SFSValidationError";
import { BaseRequest } from "./BaseRequest";

/**
 * ChangeRoomNameRequest - Request to change a room's name.
 */
export class ChangeRoomNameRequest extends BaseRequest {
    public static readonly KEY_ROOM: string = "r";
    public static readonly KEY_NAME: string = "n";

    private _room: Room;
    private _newName: string;

    constructor(room: Room, newName: string) {
        super(BaseRequest.ChangeRoomName);
        this._room = room;
        this._newName = newName;
    }

    public override validate(sfs: SmartFox): void {
        const errors: Array<string> = [];
        if (this._room === null) {
            errors.push("Provided room is null");
        }
        if (this._newName === null || this._newName.length === 0) {
            errors.push("Invalid new room name. It must be a non-null and non-empty string.");
        }
        if (errors.length > 0) {
            throw new SFSValidationError("ChangeRoomName request error", errors);
        }
    }

    public override execute(sfs: SmartFox): void {
        this._sfso.putInt(ChangeRoomNameRequest.KEY_ROOM, this._room.id);
        this._sfso.putUtfString(ChangeRoomNameRequest.KEY_NAME, this._newName);
    }
}
