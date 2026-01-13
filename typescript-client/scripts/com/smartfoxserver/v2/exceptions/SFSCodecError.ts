/**
 * SFSCodecError - Error class for SmartFoxServer codec errors.
 */
export class SFSCodecError extends Error {
    public errorId: number;

    constructor(message: string = "", id: number = 0) {
        super(message);
        this.name = "SFSCodecError";
        this.errorId = id;
    }
}
