import { ISFSArray } from "../data/ISFSArray";
import { RoomVariable } from "./RoomVariable";
import { SFSUserVariable } from "./SFSUserVariable";

/**
 * SFSRoomVariable - Implementation of RoomVariable interface.
 */
export class SFSRoomVariable extends SFSUserVariable implements RoomVariable {
    private _isPersistent: boolean = false;
    private _isPrivate: boolean = false;

    constructor(name: string, value: any, type: number = -1) {
        super(name, value, type);
    }

    public static fromSFSArray(arr: ISFSArray): RoomVariable {
        const rVar = new SFSRoomVariable(
            arr.getUtfString(0),
            arr.getElementAt(2),
            arr.getByte(1)
        );
        rVar.isPrivate = arr.getBool(3);
        return rVar;
    }

    public get isPrivate(): boolean {
        return this._isPrivate;
    }

    public get isPersistent(): boolean {
        return this._isPersistent;
    }

    public set isPrivate(value: boolean) {
        this._isPrivate = value;
    }

    public set isPersistent(value: boolean) {
        this._isPersistent = value;
    }

    public override toString(): string {
        return "[RVar: " + this._name + ", type: " + this._type + ", value: " + this._value + ", isPriv: " + this.isPrivate + "]";
    }

    public override toSFSArray(): ISFSArray {
        const arr = super.toSFSArray();
        arr.addBool(this._isPrivate);
        arr.addBool(this._isPersistent);
        return arr;
    }
}
