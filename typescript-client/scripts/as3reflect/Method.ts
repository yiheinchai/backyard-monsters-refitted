import { MetaDataContainer } from "./MetaDataContainer";
import { MetaData } from "./MetaData";
import { Parameter } from "./Parameter";
import { Type } from "./Type";

/**
 * Method - Represents a method in a class.
 */
export class Method extends MetaDataContainer {
    private _declaringType: Type;
    private _parameters: Array<Parameter>;
    private _name: string;
    private _returnType: Type;
    private _isStatic: boolean;

    constructor(declaringType: Type, name: string, isStatic: boolean, parameters: Array<Parameter>, returnType: Type, metaData: Array<MetaData> | null = null) {
        super(metaData);
        this._declaringType = declaringType;
        this._name = name;
        this._isStatic = isStatic;
        this._parameters = parameters;
        this._returnType = returnType;
    }

    public get declaringType(): Type {
        return this._declaringType;
    }

    public get name(): string {
        return this._name;
    }

    public toString(): string {
        return "[Method(name:'" + this.name + "', isStatic:" + this.isStatic + ")]";
    }

    public get returnType(): Type {
        return this._returnType;
    }

    public invoke(target: any, args: Array<any>): any {
        if (target && typeof target[this.name] === "function") {
            return target[this.name].apply(target, args);
        }
        return undefined;
    }

    public get parameters(): Array<Parameter> {
        return this._parameters;
    }

    public get fullName(): string {
        let result = "public ";
        if (this.isStatic) {
            result += "static ";
        }
        result += this.name + "(";
        for (let i = 0; i < this.parameters.length; i++) {
            const param = this.parameters[i];
            result += param.type.name;
            result += i < this.parameters.length - 1 ? ", " : "";
        }
        return result + "):" + this.returnType.name;
    }

    public get isStatic(): boolean {
        return this._isStatic;
    }
}
