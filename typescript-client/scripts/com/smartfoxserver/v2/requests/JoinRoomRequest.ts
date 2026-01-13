import { SmartFox } from "../SmartFox";
import { Room } from "../entities/Room";
import { SFSValidationError } from "../exceptions/SFSValidationError";
import { BaseRequest } from "./BaseRequest";

/**
 * JoinRoomRequest - Request to join a room.
 */
export class JoinRoomRequest extends BaseRequest {
    public static readonly KEY_ROOM: string = "r";
    public static readonly KEY_USER_LIST: string = "ul";
    public static readonly KEY_ROOM_NAME: string = "n";
    public static readonly KEY_ROOM_ID: string = "i";
    public static readonly KEY_PASS: string = "p";
    public static readonly KEY_ROOM_TO_LEAVE: string = "rl";
    public static readonly KEY_AS_SPECTATOR: string = "sp";

    private _roomId: number = -1;
    private _name: string | null = null;
    private _pass: string | null;
    private _roomIdToLeave: number;
    private _asSpectator: boolean;

    constructor(roomIdOrName: any, password: string | null = null, roomIdToLeave: number = NaN, asSpectator: boolean = false) {
        super(BaseRequest.JoinRoom);
        if (typeof roomIdOrName === 'string') {
            this._name = roomIdOrName;
        } else if (typeof roomIdOrName === 'number') {
            this._roomId = roomIdOrName;
        } else if (roomIdOrName && typeof roomIdOrName === 'object' && 'id' in roomIdOrName) {
            this._roomId = (roomIdOrName as Room).id;
        }
        this._pass = password;
        this._roomIdToLeave = roomIdToLeave;
        this._asSpectator = asSpectator;
    }

    public override validate(sfs: SmartFox): void {
        const errors: Array<string> = [];
        if (this._roomId < 0 && this._name === null) {
            errors.push("Missing Room id or name, you should provide at least one");
        }
        if (errors.length > 0) {
            throw new SFSValidationError("JoinRoom request error", errors);
        }
    }

    public override execute(sfs: SmartFox): void {
        if (this._roomId > -1) {
            this._sfso.putInt(JoinRoomRequest.KEY_ROOM_ID, this._roomId);
        } else if (this._name !== null) {
            this._sfso.putUtfString(JoinRoomRequest.KEY_ROOM_NAME, this._name);
        }
        if (this._pass !== null) {
            this._sfso.putUtfString(JoinRoomRequest.KEY_PASS, this._pass);
        }
        if (!isNaN(this._roomIdToLeave)) {
            this._sfso.putInt(JoinRoomRequest.KEY_ROOM_TO_LEAVE, this._roomIdToLeave);
        }
        if (this._asSpectator) {
            this._sfso.putBool(JoinRoomRequest.KEY_AS_SPECTATOR, this._asSpectator);
        }
    }
}
