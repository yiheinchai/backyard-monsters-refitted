/**
 * RoomPermissions - Configuration for room permission settings.
 */
export class RoomPermissions {
    private _allowNameChange: boolean = false;
    private _allowPasswordStateChange: boolean = false;
    private _allowPublicMessages: boolean = false;
    private _allowResizing: boolean = false;

    constructor() { }

    public get allowNameChange(): boolean {
        return this._allowNameChange;
    }

    public set allowNameChange(value: boolean) {
        this._allowNameChange = value;
    }

    public get allowPasswordStateChange(): boolean {
        return this._allowPasswordStateChange;
    }

    public set allowPasswordStateChange(value: boolean) {
        this._allowPasswordStateChange = value;
    }

    public get allowPublicMessages(): boolean {
        return this._allowPublicMessages;
    }

    public set allowPublicMessages(value: boolean) {
        this._allowPublicMessages = value;
    }

    public get allowResizing(): boolean {
        return this._allowResizing;
    }

    public set allowResizing(value: boolean) {
        this._allowResizing = value;
    }
}
