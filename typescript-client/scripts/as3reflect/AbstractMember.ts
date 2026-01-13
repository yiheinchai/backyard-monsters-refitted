import { MetaDataContainer } from "./MetaDataContainer";
import { MetaData } from "./MetaData";
import { IMember } from "./IMember";
import { Type } from "./Type";

/**
 * AbstractMember - Base class for class members (methods, properties).
 */
export class AbstractMember extends MetaDataContainer implements IMember {
    private _declaringType: Type;
    private _name: string;
    private _isStatic: boolean;
    private _type: Type;

    constructor(name: string, type: Type, declaringType: Type, isStatic: boolean, metaData: Array<MetaData> | null = null) {
        super(metaData);
        this._name = name;
        this._type = type;
        this._declaringType = declaringType;
        this._isStatic = isStatic;
    }

    public get name(): string {
        return this._name;
    }

    public get declaringType(): Type {
        return this._declaringType;
    }

    public get type(): Type {
        return this._type;
    }

    public get isStatic(): boolean {
        return this._isStatic;
    }
}
