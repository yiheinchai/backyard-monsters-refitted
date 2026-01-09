/**
 * SFSDataWrapper - Wrapper for typed SFS data.
 */
export class SFSDataWrapper {
    private _type: number;
    private _data: any;

    constructor(type: number, data: any) {
        this._type = type;
        this._data = data;
    }

    public get type(): number {
        return this._type;
    }

    public get data(): any {
        return this._data;
    }
}
