import { MetaDataArgument } from "./MetaDataArgument";

/**
 * MetaData - Represents metadata attached to a type or member.
 */
export class MetaData {
    public static readonly TRANSIENT: string = "Transient";
    public static readonly BINDABLE: string = "Bindable";

    private _arguments: Array<MetaDataArgument>;
    private _name: string;

    constructor(name: string, args: Array<MetaDataArgument> | null = null) {
        this._name = name;
        this._arguments = args === null ? [] : args;
    }

    public hasArgumentWithKey(key: string): boolean {
        return this.getArgument(key) !== null;
    }

    public getArgument(key: string): MetaDataArgument | null {
        for (const arg of this._arguments) {
            if (arg.key === key) {
                return arg;
            }
        }
        return null;
    }

    public get arguments(): Array<MetaDataArgument> {
        return this._arguments;
    }

    public get name(): string {
        return this._name;
    }

    public toString(): string {
        return "[MetaData(" + this.name + ", " + this.arguments + ")]";
    }
}
