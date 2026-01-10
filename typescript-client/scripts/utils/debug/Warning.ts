/**
 * Warning - Debug utility for showing warnings.
 */
export class Warning {
    constructor() {}

    public static Show(message: string, cls: any): void {
        // In TypeScript, we don't have flash.utils.getQualifiedClassName
        // Using constructor.name as a substitute
        const className = cls.name || cls.constructor?.name || "Unknown";
        console.warn("Class: " + className + "\nWarning: " + message);
    }
}
