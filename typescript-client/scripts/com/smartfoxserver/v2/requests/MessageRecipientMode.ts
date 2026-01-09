/**
 * MessageRecipientMode - Constants and class for message recipient modes.
 */
export class MessageRecipientMode {
    public static readonly TO_USER: number = 0;
    public static readonly TO_ROOM: number = 1;
    public static readonly TO_GROUP: number = 2;
    public static readonly TO_ZONE: number = 3;

    private _target: any;
    private _mode: number;

    constructor(mode: number, target: any) {
        if (mode < MessageRecipientMode.TO_USER || mode > MessageRecipientMode.TO_ZONE) {
            throw new Error("Illegal recipient mode: " + mode);
        }
        this._mode = mode;
        this._target = target;
    }

    public get mode(): number {
        return this._mode;
    }

    public get target(): any {
        return this._target;
    }
}
