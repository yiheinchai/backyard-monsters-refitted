/**
 * SFSDataType - Data type constants for SFS serialization.
 */
export class SFSDataType {
    public static readonly NULL: number = 0;
    public static readonly BOOL: number = 1;
    public static readonly BYTE: number = 2;
    public static readonly SHORT: number = 3;
    public static readonly INT: number = 4;
    public static readonly LONG: number = 5;
    public static readonly FLOAT: number = 6;
    public static readonly DOUBLE: number = 7;
    public static readonly UTF_STRING: number = 8;
    public static readonly BOOL_ARRAY: number = 9;
    public static readonly BYTE_ARRAY: number = 10;
    public static readonly SHORT_ARRAY: number = 11;
    public static readonly INT_ARRAY: number = 12;
    public static readonly LONG_ARRAY: number = 13;
    public static readonly FLOAT_ARRAY: number = 14;
    public static readonly DOUBLE_ARRAY: number = 15;
    public static readonly UTF_STRING_ARRAY: number = 16;
    public static readonly SFS_ARRAY: number = 17;
    public static readonly SFS_OBJECT: number = 18;
    public static readonly CLASS: number = 19;

    private static readonly TYPE_NAMES: Array<string> = [
        "NULL", "BOOL", "BYTE", "SHORT", "INT", "LONG", "FLOAT", "DOUBLE",
        "UTF_STRING", "BOOL_ARRAY", "BYTE_ARRAY", "SHORT_ARRAY", "INT_ARRAY",
        "LONG_ARRAY", "FLOAT_ARRAY", "DOUBLE_ARRAY", "UTF_STRING_ARRAY",
        "SFS_ARRAY", "SFS_OBJECT", "CLASS"
    ];

    constructor() { }

    public static fromId(id: number): string {
        return SFSDataType.TYPE_NAMES[id];
    }
}
