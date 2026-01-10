import { ClassNotFoundError } from "./errors/ClassNotFoundError";

/**
 * ClassUtils - Utility functions for working with classes.
 * NOTE: This is a simplified TypeScript version. Flash-specific APIs are not available.
 */
export class ClassUtils {
    private static readonly PACKAGE_CLASS_SEPARATOR: string = "::";

    constructor() {}

    public static getName(cls: any): string {
        return ClassUtils.getNameFromFullyQualifiedName(ClassUtils.getFullyQualifiedName(cls));
    }

    public static getImplementedInterfaces(cls: any): Array<any> {
        // Not directly available in TypeScript at runtime
        return [];
    }

    public static getNameFromFullyQualifiedName(fullName: string): string {
        const idx = fullName.indexOf(ClassUtils.PACKAGE_CLASS_SEPARATOR);
        if (idx === -1) {
            return fullName;
        }
        return fullName.substring(idx + ClassUtils.PACKAGE_CLASS_SEPARATOR.length);
    }

    public static getFullyQualifiedImplementedInterfaceNames(cls: any, replaceColons: boolean = false): Array<string> {
        // Not directly available in TypeScript at runtime
        return [];
    }

    public static isImplementationOf(cls: any, interfaze: any): boolean {
        // Simplified check using instanceof
        return cls && interfaze && new cls() instanceof interfaze;
    }

    public static forInstance(instance: any, applicationDomain: any = null): any {
        if (instance === null || instance === undefined) {
            return null;
        }
        return instance.constructor;
    }

    public static getFullyQualifiedSuperClassName(cls: any, replaceColons: boolean = false): string {
        const parent = Object.getPrototypeOf(cls.prototype)?.constructor;
        return parent?.name || "";
    }

    public static getFullyQualifiedName(cls: any, replaceColons: boolean = false): string {
        return cls?.name || "";
    }

    public static forName(name: string, applicationDomain: any = null): any {
        // Runtime class lookup not available in TypeScript
        throw new ClassNotFoundError("A class with the name '" + name + "' could not be found. Runtime class lookup not available.");
    }

    public static newInstance(cls: any, args: Array<any> | null = null): any {
        const params = args === null ? [] : args;
        return new cls(...params);
    }

    public static convertFullyQualifiedName(name: string): string {
        return name.replace(ClassUtils.PACKAGE_CLASS_SEPARATOR, ".");
    }

    public static isSubclassOf(cls: any, parentClass: any): boolean {
        let current = cls;
        while (current) {
            if (current === parentClass) {
                return true;
            }
            current = Object.getPrototypeOf(current);
        }
        return false;
    }

    public static getSuperClass(cls: any): any {
        return Object.getPrototypeOf(cls.prototype)?.constructor || null;
    }

    public static getImplementedInterfaceNames(cls: any): Array<string> {
        return [];
    }

    public static getSuperClassName(cls: any): string {
        const fullName = ClassUtils.getFullyQualifiedSuperClassName(cls);
        const idx = fullName.indexOf(ClassUtils.PACKAGE_CLASS_SEPARATOR);
        return idx === -1 ? fullName : fullName.substring(idx + ClassUtils.PACKAGE_CLASS_SEPARATOR.length);
    }
}
