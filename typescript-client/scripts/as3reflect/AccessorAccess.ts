/**
 * AccessorAccess - Represents the access type of an accessor (readonly, writeonly, readwrite).
 */
export class AccessorAccess {
    private static readonly READ_ONLY_VALUE: string = "readonly";
    private static readonly READ_WRITE_VALUE: string = "readwrite";
    private static readonly WRITE_ONLY_VALUE: string = "writeonly";

    public static readonly READ_ONLY: AccessorAccess = new AccessorAccess(AccessorAccess.READ_ONLY_VALUE);
    public static readonly READ_WRITE: AccessorAccess = new AccessorAccess(AccessorAccess.READ_WRITE_VALUE);
    public static readonly WRITE_ONLY: AccessorAccess = new AccessorAccess(AccessorAccess.WRITE_ONLY_VALUE);

    private _name: string;

    constructor(name: string) {
        this._name = name;
    }

    public static fromString(value: string): AccessorAccess | null {
        switch (value) {
            case AccessorAccess.READ_ONLY_VALUE:
                return AccessorAccess.READ_ONLY;
            case AccessorAccess.WRITE_ONLY_VALUE:
                return AccessorAccess.WRITE_ONLY;
            case AccessorAccess.READ_WRITE_VALUE:
                return AccessorAccess.READ_WRITE;
            default:
                return null;
        }
    }

    public get name(): string {
        return this._name;
    }
}
