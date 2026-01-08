/**
 * Chat channel representation.
 */
export class Channel {
    public static readonly ADMIN: Channel = new Channel("admin", "system");

    private name: string;
    private _type: string;

    constructor(name: string, type: string) {
        this.name = name;
        this._type = type;
    }

    public get Name(): string {
        return this.name;
    }

    public get Type(): string {
        return this._type;
    }
}
