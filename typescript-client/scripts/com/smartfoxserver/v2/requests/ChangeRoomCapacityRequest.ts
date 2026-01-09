import { SmartFox } from "../SmartFox";
import { Room } from "../entities/Room";
import { SFSValidationError } from "../exceptions/SFSValidationError";
import { BaseRequest } from "./BaseRequest";

/**
 * ChangeRoomCapacityRequest - Request to change a room's user/spectator capacity.
 */
export class ChangeRoomCapacityRequest extends BaseRequest {
    public static readonly KEY_ROOM: string = "r";
    public static readonly KEY_USER_SIZE: string = "u";
    public static readonly KEY_SPEC_SIZE: string = "s";

    private _room: Room;
    private _newMaxUsers: number;
    private _newMaxSpect: number;

    constructor(room: Room, newMaxUsers: number, newMaxSpectators: number) {
        super(BaseRequest.ChangeRoomCapacity);
        this._room = room;
        this._newMaxUsers = newMaxUsers;
        this._newMaxSpect = newMaxSpectators;
    }

    public override validate(sfs: SmartFox): void {
        const errors: Array<string> = [];
        if (this._room === null) {
            errors.push("Provided room is null");
        }
        if (errors.length > 0) {
            throw new SFSValidationError("ChangeRoomCapacity request error", errors);
        }
    }

    public override execute(sfs: SmartFox): void {
        this._sfso.putInt(ChangeRoomCapacityRequest.KEY_ROOM, this._room.id);
        this._sfso.putInt(ChangeRoomCapacityRequest.KEY_USER_SIZE, this._newMaxUsers);
        this._sfso.putInt(ChangeRoomCapacityRequest.KEY_SPEC_SIZE, this._newMaxSpect);
    }
}
