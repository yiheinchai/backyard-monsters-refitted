/**
 * Instance - Utility for creating class instances with arguments.
 */
export class Instance {
    /**
     * Creates an instance of a class with the given arguments.
     */
    public static create<T>(cls: new (...args: any[]) => T, args: Array<any> | null = null): T {
        if (args === null || args.length === 0) {
            return new cls();
        }
        return new cls(...args);
    }

    /**
     * Creates an empty instance of a class (without calling constructor logic).
     * NOTE: Not fully supported in TypeScript - creates a normal instance.
     */
    public static createEmpty<T>(cls: new (...args: any[]) => T): T {
        return Object.create(cls.prototype);
    }
}
