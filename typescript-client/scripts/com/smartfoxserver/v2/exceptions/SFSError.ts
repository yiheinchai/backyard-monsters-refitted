/**
 * SFSError - Base error class for SmartFoxServer errors.
 */
export class SFSError extends Error {
    public errorId: number;

    constructor(message: string, id: number = 0) {
        super(message);
        this.name = "SFSError";
        this.errorId = id;
    }
}
