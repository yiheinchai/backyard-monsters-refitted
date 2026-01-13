import { ISFSArray } from "../data/ISFSArray";
import { ISFSObject } from "../data/ISFSObject";
import { SFSArray } from "../data/SFSArray";
import { SFSError } from "../../exceptions/SFSError";
import { BuddyVariable } from "./BuddyVariable";
import { VariableType } from "./VariableType";

/**
 * SFSBuddyVariable - Implementation of BuddyVariable interface.
 */
export class SFSBuddyVariable implements BuddyVariable {
    public static readonly OFFLINE_PREFIX: string = "$";

    protected _name: string;
    protected _type: string = "";
    protected _value: any;

    constructor(name: string, value: any, type: number = -1) {
        this._name = name;
        if (type > -1) {
            this._value = value;
            this._type = VariableType.getTypeName(type);
        } else {
            this.setValue(value);
        }
    }

    public static fromSFSArray(arr: ISFSArray): BuddyVariable {
        return new SFSBuddyVariable(
            arr.getUtfString(0),
            arr.getElementAt(2),
            arr.getByte(1)
        );
    }

    public get isOffline(): boolean {
        return this._name.charAt(0) === "$";
    }

    public get name(): string {
        return this._name;
    }

    public get type(): string {
        return this._type;
    }

    public getValue(): any {
        return this._value;
    }

    public getBoolValue(): boolean {
        return this._value as boolean;
    }

    public getIntValue(): number {
        return this._value as number;
    }

    public getDoubleValue(): number {
        return this._value as number;
    }

    public getStringValue(): string {
        return this._value as string;
    }

    public getSFSObjectValue(): ISFSObject {
        return this._value as ISFSObject;
    }

    public getSFSArrayValue(): ISFSArray {
        return this._value as ISFSArray;
    }

    public isNull(): boolean {
        return this.type === VariableType.getTypeName(VariableType.NULL);
    }

    public toSFSArray(): ISFSArray {
        const arr = SFSArray.newInstance();
        arr.addUtfString(this._name);
        arr.addByte(VariableType.getTypeFromName(this._type));
        this.populateArrayWithValue(arr);
        return arr;
    }

    public toString(): string {
        return "[BuddyVar: " + this._name + ", type: " + this._type + ", value: " + this._value + "]";
    }

    private populateArrayWithValue(arr: ISFSArray): void {
        const typeId = VariableType.getTypeFromName(this._type);
        switch (typeId) {
            case VariableType.NULL:
                arr.addNull();
                break;
            case VariableType.BOOL:
                arr.addBool(this.getBoolValue());
                break;
            case VariableType.INT:
                arr.addInt(this.getIntValue());
                break;
            case VariableType.DOUBLE:
                arr.addDouble(this.getDoubleValue());
                break;
            case VariableType.STRING:
                arr.addUtfString(this.getStringValue());
                break;
            case VariableType.OBJECT:
                arr.addSFSObject(this.getSFSObjectValue());
                break;
            case VariableType.ARRAY:
                arr.addSFSArray(this.getSFSArrayValue());
                break;
        }
    }

    private setValue(value: any): void {
        this._value = value;
        if (value === null || value === undefined) {
            this._type = VariableType.getTypeName(VariableType.NULL);
        } else {
            const valType = typeof value;
            if (valType === "boolean") {
                this._type = VariableType.getTypeName(VariableType.BOOL);
            } else if (valType === "number") {
                if (Number.isInteger(value)) {
                    this._type = VariableType.getTypeName(VariableType.INT);
                } else {
                    this._type = VariableType.getTypeName(VariableType.DOUBLE);
                }
            } else if (valType === "string") {
                this._type = VariableType.getTypeName(VariableType.STRING);
            } else if (valType === "object") {
                const className = value.constructor?.name || "Object";
                if (className === "SFSObject") {
                    this._type = VariableType.getTypeName(VariableType.OBJECT);
                } else if (className === "SFSArray") {
                    this._type = VariableType.getTypeName(VariableType.ARRAY);
                } else {
                    throw new SFSError("Unsupport SFS Variable type: " + className);
                }
            }
        }
    }
}
