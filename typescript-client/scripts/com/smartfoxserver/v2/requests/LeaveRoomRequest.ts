import { SmartFox } from "../SmartFox";
import { Room } from "../entities/Room";
import { SFSValidationError } from "../exceptions/SFSValidationError";
import { BaseRequest } from "./BaseRequest";

/**
 * LeaveRoomRequest - Request to leave a room.
 */
export class LeaveRoomRequest extends BaseRequest {
    public static readonly KEY_ROOM_ID: string = "r";

    private _room: Room | null;

    constructor(room: Room | null = null) {
        super(BaseRequest.LeaveRoom);
        this._room = room;
    }

    public override validate(sfs: SmartFox): void {
        const errors: Array<string> = [];
        if (sfs.joinedRooms.length < 1) {
            errors.push("You are not joined in any rooms");
        }
        if (errors.length > 0) {
            throw new SFSValidationError("LeaveRoom request error", errors);
        }
    }

    public override execute(sfs: SmartFox): void {
        if (this._room !== null) {
            this._sfso.putInt(LeaveRoomRequest.KEY_ROOM_ID, this._room.id);
        }
    }
}
