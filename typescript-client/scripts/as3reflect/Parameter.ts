import { Type } from "./Type";

/**
 * Parameter - Represents a method parameter.
 */
export class Parameter {
    private _type: Type;
    private _index: number;
    private _isOptional: boolean;

    constructor(index: number, type: Type, isOptional: boolean = false) {
        this._index = index;
        this._type = type;
        this._isOptional = isOptional;
    }

    public get index(): number {
        return this._index;
    }

    public get isOptional(): boolean {
        return this._isOptional;
    }

    public get type(): Type {
        return this._type;
    }
}
