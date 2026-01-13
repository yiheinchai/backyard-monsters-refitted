/**
 * RoomExtension - Configuration for room extensions.
 */
export class RoomExtension {
    private _id: string;
    private _className: string;
    private _propertiesFile: string;

    constructor(id: string, className: string) {
        this._id = id;
        this._className = className;
        this._propertiesFile = "";
    }

    public get id(): string {
        return this._id;
    }

    public get className(): string {
        return this._className;
    }

    public get propertiesFile(): string {
        return this._propertiesFile;
    }

    public set propertiesFile(value: string) {
        this._propertiesFile = value;
    }
}
