/**
 * VariableType - Constants for variable types.
 */
export class VariableType {
    public static readonly NULL: number = 0;
    public static readonly BOOL: number = 1;
    public static readonly INT: number = 2;
    public static readonly DOUBLE: number = 3;
    public static readonly STRING: number = 4;
    public static readonly OBJECT: number = 5;
    public static readonly ARRAY: number = 6;

    private static readonly TYPES_AS_STRING: Array<string> = ["Null", "Bool", "Int", "Double", "String", "Object", "Array"];

    private constructor() {
        throw new Error("This class is not instantiable");
    }

    public static getTypeName(type: number): string {
        return VariableType.TYPES_AS_STRING[type];
    }

    public static getTypeFromName(name: string): number {
        return VariableType.TYPES_AS_STRING.indexOf(name);
    }
}
