import { SingletonLock } from "../../../config/singletonlock/SingletonLock";
import { ExposedDefinition } from "./ExposedDefinition";
import { ExposedStructure } from "./ExposedStructure";

/**
 * ExposedDefinitionManager - Manages ExposedDefinition instances (singleton).
 */
export class ExposedDefinitionManager {
    private static s_Instance: ExposedDefinitionManager | null = null;
    public static readonly VECTOR_TYPE_NAME: string = "__AS3__.vec::Vector.<";

    private m_ExposedPrimitives: Map<string, any> = new Map();
    private m_ExposedDefinitions: Map<string, ExposedDefinition> = new Map();

    constructor(_lock: SingletonLock) {
        this.m_ExposedPrimitives.set("Boolean", Boolean);
        this.m_ExposedPrimitives.set("int", Number);
        this.m_ExposedPrimitives.set("Number", Number);
        this.m_ExposedPrimitives.set("String", String);
        this.m_ExposedPrimitives.set("uint", Number);
        this.m_ExposedPrimitives.set("boolean", Boolean);
        this.m_ExposedPrimitives.set("number", Number);
        this.m_ExposedPrimitives.set("string", String);
    }

    public static get instance(): ExposedDefinitionManager {
        if (ExposedDefinitionManager.s_Instance === null) {
            ExposedDefinitionManager.s_Instance = new ExposedDefinitionManager(new SingletonLock());
        }
        return ExposedDefinitionManager.s_Instance;
    }

    public IsPrimitiveType(typeName: string): boolean {
        return this.m_ExposedPrimitives.has(typeName);
    }

    public FindOrCacheExposedDefinition(structure: ExposedStructure): ExposedDefinition {
        const className = structure.constructor?.name || "";
        let definition = this.m_ExposedDefinitions.get(className);
        if (definition) {
            return definition;
        }
        definition = new ExposedDefinition(structure);
        this.m_ExposedDefinitions.set(className, definition);
        return definition;
    }

    public DoesInheritFrom(cls: any, parentCls: any): boolean {
        if (!cls || !parentCls) {
            return false;
        }
        let current = cls;
        while (current && current !== Object) {
            if (current === parentCls) {
                return true;
            }
            current = Object.getPrototypeOf(current);
        }
        return false;
    }

    public GetParentClass(cls: any): any {
        return cls ? Object.getPrototypeOf(cls) : null;
    }
}
