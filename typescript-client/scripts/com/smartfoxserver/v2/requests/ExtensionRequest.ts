import { SmartFox } from "../SmartFox";
import { Room } from "../entities/Room";
import { ISFSObject } from "../entities/data/ISFSObject";
import { SFSObject } from "../entities/data/SFSObject";
import { SFSValidationError } from "../exceptions/SFSValidationError";
import { BaseRequest } from "./BaseRequest";

/**
 * ExtensionRequest - Request to call a server-side extension.
 */
export class ExtensionRequest extends BaseRequest {
    public static readonly KEY_CMD: string = "c";
    public static readonly KEY_PARAMS: string = "p";
    public static readonly KEY_ROOM: string = "r";

    private _extCmd: string;
    private _params: ISFSObject;
    private _room: Room | null;
    private _useUDP: boolean;

    constructor(cmd: string, params: ISFSObject | null = null, room: Room | null = null, useUDP: boolean = false) {
        super(BaseRequest.CallExtension);
        this._targetController = 1;
        this._extCmd = cmd;
        this._params = params!;
        this._room = room;
        this._useUDP = useUDP;
        if (this._params === null) {
            this._params = new SFSObject();
        }
    }

    public get useUDP(): boolean {
        return this._useUDP;
    }

    public override validate(sfs: SmartFox): void {
        const errors: Array<string> = [];
        if (this._extCmd === null || this._extCmd.length === 0) {
            errors.push("Missing extension command");
        }
        if (this._params === null) {
            errors.push("Missing extension parameters");
        }
        if (errors.length > 0) {
            throw new SFSValidationError("ExtensionCall request error", errors);
        }
    }

    public override execute(sfs: SmartFox): void {
        this._sfso.putUtfString(ExtensionRequest.KEY_CMD, this._extCmd);
        this._sfso.putInt(ExtensionRequest.KEY_ROOM, this._room === null ? -1 : this._room.id);
        this._sfso.putSFSObject(ExtensionRequest.KEY_PARAMS, this._params);
    }
}
