import { Field } from "./Field";
import { AccessorAccess } from "./AccessorAccess";
import { MetaData } from "./MetaData";
import { Type } from "./Type";

/**
 * Accessor - Represents an accessor (getter/setter) in a class.
 */
export class Accessor extends Field {
    private _access: AccessorAccess;

    constructor(name: string, access: AccessorAccess, type: Type, declaringType: Type, isStatic: boolean, metaData: Array<MetaData> | null = null) {
        super(name, type, declaringType, isStatic, metaData);
        this._access = access;
    }

    public get access(): AccessorAccess {
        return this._access;
    }
}
