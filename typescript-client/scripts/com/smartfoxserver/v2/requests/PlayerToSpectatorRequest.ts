import { SmartFox } from "../SmartFox";
import { Room } from "../entities/Room";
import { SFSValidationError } from "../exceptions/SFSValidationError";
import { BaseRequest } from "./BaseRequest";

/**
 * PlayerToSpectatorRequest - Request to switch from player to spectator.
 */
export class PlayerToSpectatorRequest extends BaseRequest {
    public static readonly KEY_ROOM_ID: string = "r";
    public static readonly KEY_USER_ID: string = "u";

    private _room: Room | null;

    constructor(room: Room | null = null) {
        super(BaseRequest.PlayerToSpectator);
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
        if (this._room === null) {
            this._room = sfs.lastJoinedRoom;
        }
        this._sfso.putInt(PlayerToSpectatorRequest.KEY_ROOM_ID, this._room!.id);
    }
}
