import { SmartFox } from "../SmartFox";
import { Room } from "../entities/Room";
import { SFSValidationError } from "../exceptions/SFSValidationError";
import { BaseRequest } from "./BaseRequest";

/**
 * SpectatorToPlayerRequest - Request to switch from spectator to player.
 */
export class SpectatorToPlayerRequest extends BaseRequest {
    public static readonly KEY_ROOM_ID: string = "r";
    public static readonly KEY_USER_ID: string = "u";
    public static readonly KEY_PLAYER_ID: string = "p";

    private _room: Room | null;

    constructor(room: Room | null = null) {
        super(BaseRequest.SpectatorToPlayer);
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
        this._sfso.putInt(SpectatorToPlayerRequest.KEY_ROOM_ID, this._room!.id);
    }
}
