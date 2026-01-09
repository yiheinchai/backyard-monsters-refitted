import { SmartFox } from "../SmartFox";
import { Room } from "../entities/Room";
import { ISFSArray } from "../entities/data/ISFSArray";
import { SFSArray } from "../entities/data/SFSArray";
import { RoomVariable } from "../entities/variables/RoomVariable";
import { SFSValidationError } from "../exceptions/SFSValidationError";
import { BaseRequest } from "./BaseRequest";

/**
 * SetRoomVariablesRequest - Request to set room variables.
 */
export class SetRoomVariablesRequest extends BaseRequest {
    public static readonly KEY_VAR_ROOM: string = "r";
    public static readonly KEY_VAR_LIST: string = "vl";

    private _roomVariables: Array<RoomVariable>;
    private _room: Room | null;

    constructor(roomVariables: Array<RoomVariable>, room: Room | null = null) {
        super(BaseRequest.SetRoomVariables);
        this._roomVariables = roomVariables;
        this._room = room;
    }

    public override validate(sfs: SmartFox): void {
        const errors: Array<string> = [];
        if (this._room !== null) {
            if (!this._room.containsUser(sfs.mySelf)) {
                errors.push("You are not joined in the target room");
            }
        } else if (sfs.lastJoinedRoom === null) {
            errors.push("You are not joined in any rooms");
        }
        if (this._roomVariables === null || this._roomVariables.length === 0) {
            errors.push("No variables were specified");
        }
        if (errors.length > 0) {
            throw new SFSValidationError("SetRoomVariables request error", errors);
        }
    }

    public override execute(sfs: SmartFox): void {
        const varList: ISFSArray = SFSArray.newInstance();
        for (const rVar of this._roomVariables) {
            varList.addSFSArray(rVar.toSFSArray());
        }
        if (this._room === null) {
            this._room = sfs.lastJoinedRoom;
        }
        this._sfso.putSFSArray(SetRoomVariablesRequest.KEY_VAR_LIST, varList);
        this._sfso.putInt(SetRoomVariablesRequest.KEY_VAR_ROOM, this._room!.id);
    }
}
