/**
 * SFSValidationError - Error class for SmartFoxServer validation errors.
 */
export class SFSValidationError extends Error {
    private _errors: Array<any>;

    constructor(message: string, errors: Array<any>, id: number = 0) {
        super(message);
        this.name = "SFSValidationError";
        this._errors = errors;
    }

    public get errors(): Array<any> {
        return this._errors;
    }
}
