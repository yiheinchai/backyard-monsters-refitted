import { SmartFox } from "../SmartFox";
import { Room } from "../entities/Room";
import { ISFSArray } from "../entities/data/ISFSArray";
import { SFSArray } from "../entities/data/SFSArray";
import { RoomVariable } from "../entities/variables/RoomVariable";
import { SFSValidationError } from "../exceptions/SFSValidationError";
import { BaseRequest } from "./BaseRequest";
import { RoomSettings } from "./RoomSettings";

/**
 * CreateRoomRequest - Request to create a new room.
 */
export class CreateRoomRequest extends BaseRequest {
    public static readonly KEY_ROOM: string = "r";
    public static readonly KEY_NAME: string = "n";
    public static readonly KEY_PASSWORD: string = "p";
    public static readonly KEY_GROUP_ID: string = "g";
    public static readonly KEY_ISGAME: string = "ig";
    public static readonly KEY_MAXUSERS: string = "mu";
    public static readonly KEY_MAXSPECTATORS: string = "ms";
    public static readonly KEY_MAXVARS: string = "mv";
    public static readonly KEY_ROOMVARS: string = "rv";
    public static readonly KEY_PERMISSIONS: string = "pm";
    public static readonly KEY_EVENTS: string = "ev";
    public static readonly KEY_EXTID: string = "xn";
    public static readonly KEY_EXTCLASS: string = "xc";
    public static readonly KEY_EXTPROP: string = "xp";
    public static readonly KEY_AUTOJOIN: string = "aj";
    public static readonly KEY_ROOM_TO_LEAVE: string = "rl";

    private _settings: RoomSettings;
    private _autoJoin: boolean;
    private _roomToLeave: Room | null;

    constructor(settings: RoomSettings, autoJoin: boolean = false, roomToLeave: Room | null = null) {
        super(BaseRequest.CreateRoom);
        this._settings = settings;
        this._autoJoin = autoJoin;
        this._roomToLeave = roomToLeave;
    }

    public override execute(sfs: SmartFox): void {
        this._sfso.putUtfString(CreateRoomRequest.KEY_NAME, this._settings.name);
        this._sfso.putUtfString(CreateRoomRequest.KEY_GROUP_ID, this._settings.groupId);
        this._sfso.putUtfString(CreateRoomRequest.KEY_PASSWORD, this._settings.password);
        this._sfso.putBool(CreateRoomRequest.KEY_ISGAME, this._settings.isGame);
        this._sfso.putShort(CreateRoomRequest.KEY_MAXUSERS, this._settings.maxUsers);
        this._sfso.putShort(CreateRoomRequest.KEY_MAXSPECTATORS, this._settings.maxSpectators);
        this._sfso.putShort(CreateRoomRequest.KEY_MAXVARS, this._settings.maxVariables);

        if (this._settings.variables !== null && this._settings.variables.length > 0) {
            const varArray: ISFSArray = SFSArray.newInstance();
            for (const v of this._settings.variables) {
                if (v && typeof v.toSFSArray === 'function') {
                    const roomVar = v as RoomVariable;
                    varArray.addSFSArray(roomVar.toSFSArray());
                }
            }
            this._sfso.putSFSArray(CreateRoomRequest.KEY_ROOMVARS, varArray);
        }

        if (this._settings.permissions !== null) {
            const perms: Array<boolean> = [];
            perms.push(this._settings.permissions.allowNameChange);
            perms.push(this._settings.permissions.allowPasswordStateChange);
            perms.push(this._settings.permissions.allowPublicMessages);
            perms.push(this._settings.permissions.allowResizing);
            this._sfso.putBoolArray(CreateRoomRequest.KEY_PERMISSIONS, perms);
        }

        if (this._settings.events !== null) {
            const evts: Array<boolean> = [];
            evts.push(this._settings.events.allowUserEnter);
            evts.push(this._settings.events.allowUserExit);
            evts.push(this._settings.events.allowUserCountChange);
            evts.push(this._settings.events.allowUserVariablesUpdate);
            this._sfso.putBoolArray(CreateRoomRequest.KEY_EVENTS, evts);
        }

        if (this._settings.extension !== null) {
            this._sfso.putUtfString(CreateRoomRequest.KEY_EXTID, this._settings.extension.id);
            this._sfso.putUtfString(CreateRoomRequest.KEY_EXTCLASS, this._settings.extension.className);
            if (this._settings.extension.propertiesFile !== null && this._settings.extension.propertiesFile.length > 0) {
                this._sfso.putUtfString(CreateRoomRequest.KEY_EXTPROP, this._settings.extension.propertiesFile);
            }
        }

        this._sfso.putBool(CreateRoomRequest.KEY_AUTOJOIN, this._autoJoin);
        if (this._roomToLeave !== null) {
            this._sfso.putInt(CreateRoomRequest.KEY_ROOM_TO_LEAVE, this._roomToLeave.id);
        }
    }

    public override validate(sfs: SmartFox): void {
        const errors: Array<string> = [];
        if (this._settings.name === null || this._settings.name.length === 0) {
            errors.push("Missing room name");
        }
        if (this._settings.maxUsers <= 0) {
            errors.push("maxUsers must be > 0");
        }
        if (this._settings.extension !== null) {
            if (this._settings.extension.className === null || this._settings.extension.className.length === 0) {
                errors.push("Missing Extension class name");
            }
            if (this._settings.extension.id === null || this._settings.extension.id.length === 0) {
                errors.push("Missing Extension id");
            }
        }
        if (errors.length > 0) {
            throw new SFSValidationError("CreateRoom request error", errors);
        }
    }
}
