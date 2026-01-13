import { MetaDataContainer } from "./MetaDataContainer";
import { MetaData } from "./MetaData";
import { Field } from "./Field";
import { Method } from "./Method";

/**
 * Type - Represents a class type with reflection information.
 * NOTE: This is a simplified TypeScript version. Flash describeType is not available.
 */
export class Type extends MetaDataContainer {
    public static readonly UNTYPED: Type = new Type();
    public static readonly PRIVATE: Type = new Type();
    public static readonly VOID: Type = new Type();

    private static _cache: Map<string, Type> = new Map();

    private _class: any = null;
    private _accessors: Array<any> = [];
    private _isStatic: boolean = false;
    private _fullName: string = "";
    private _isFinal: boolean = false;
    private _isDynamic: boolean = false;
    private _staticConstants: Array<any> = [];
    private _constants: Array<any> = [];
    private _fields: Array<Field> = [];
    private _name: string = "";
    private _methods: Array<Method> = [];
    private _variables: Array<any> = [];
    private _staticVariables: Array<any> = [];

    constructor() {
        super();
    }

    public static forName(name: string): Type | null {
        switch (name) {
            case "void":
                return Type.VOID;
            case "*":
                return Type.UNTYPED;
            default:
                // In TypeScript, we cannot do runtime class lookup by name
                console.warn("Type.forName: Runtime class lookup not available in TypeScript for: " + name);
                return null;
        }
    }

    public static forInstance(instance: any): Type | null {
        if (instance === null || instance === undefined) {
            return null;
        }
        return Type.forClass(instance.constructor);
    }

    public static forClass(cls: any): Type {
        const fullName = cls?.name || "";
        if (Type._cache.has(fullName)) {
            return Type._cache.get(fullName)!;
        }
        const type = new Type();
        Type._cache.set(fullName, type);
        type.fullName = fullName;
        type.name = fullName;
        type.clazz = cls;
        // NOTE: Detailed reflection info is not available in TypeScript
        return type;
    }

    public get staticConstants(): Array<any> { return this._staticConstants; }
    public set staticConstants(value: Array<any>) { this._staticConstants = value; }

    public get name(): string { return this._name; }
    public set name(value: string) { this._name = value; }

    public get accessors(): Array<any> { return this._accessors; }
    public set accessors(value: Array<any>) { this._accessors = value; }

    public get constants(): Array<any> { return this._constants; }
    public set constants(value: Array<any>) { this._constants = value; }

    public get staticVariables(): Array<any> { return this._staticVariables; }
    public set staticVariables(value: Array<any>) { this._staticVariables = value; }

    public get methods(): Array<Method> { return this._methods; }
    public set methods(value: Array<Method>) { this._methods = value; }

    public get isDynamic(): boolean { return this._isDynamic; }
    public set isDynamic(value: boolean) { this._isDynamic = value; }

    public get clazz(): any { return this._class; }
    public set clazz(value: any) { this._class = value; }

    public get isStatic(): boolean { return this._isStatic; }
    public set isStatic(value: boolean) { this._isStatic = value; }

    public get fullName(): string { return this._fullName; }
    public set fullName(value: string) { this._fullName = value; }

    public get isFinal(): boolean { return this._isFinal; }
    public set isFinal(value: boolean) { this._isFinal = value; }

    public get variables(): Array<any> { return this._variables; }
    public set variables(value: Array<any>) { this._variables = value; }

    public get fields(): Array<Field> {
        return [...this.accessors, ...this._staticConstants, ...this._constants, ...this._staticVariables, ...this._variables];
    }

    public getField(name: string): Field | null {
        for (const field of this.fields) {
            if (field.name === name) {
                return field;
            }
        }
        return null;
    }

    public getMethod(name: string): Method | null {
        for (const method of this._methods) {
            if (method.name === name) {
                return method;
            }
        }
        return null;
    }
}
