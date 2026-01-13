/**
 * RoomEvents - Configuration for room event settings.
 */
export class RoomEvents {
    private _allowUserEnter: boolean;
    private _allowUserExit: boolean;
    private _allowUserCountChange: boolean;
    private _allowUserVariablesUpdate: boolean;

    constructor() {
        this._allowUserCountChange = false;
        this._allowUserEnter = false;
        this._allowUserExit = false;
        this._allowUserVariablesUpdate = false;
    }

    public get allowUserEnter(): boolean {
        return this._allowUserEnter;
    }

    public set allowUserEnter(value: boolean) {
        this._allowUserEnter = value;
    }

    public get allowUserExit(): boolean {
        return this._allowUserExit;
    }

    public set allowUserExit(value: boolean) {
        this._allowUserExit = value;
    }

    public get allowUserCountChange(): boolean {
        return this._allowUserCountChange;
    }

    public set allowUserCountChange(value: boolean) {
        this._allowUserCountChange = value;
    }

    public get allowUserVariablesUpdate(): boolean {
        return this._allowUserVariablesUpdate;
    }

    public set allowUserVariablesUpdate(value: boolean) {
        this._allowUserVariablesUpdate = value;
    }
}
