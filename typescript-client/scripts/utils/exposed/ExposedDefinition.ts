import { ExposedAccessor } from "./ExposedAccessor";

/**
 * ExposedDefinition - Holds metadata about an ExposedStructure class.
 */
export class ExposedDefinition {
    public static readonly EXPOSED_FOR_EDITOR: string = "Editor";
    public static readonly EXPOSED_FOR_LOAD: string = "Load";
    public static readonly EXPOSED_FOR_SAVE: string = "Save";

    private m_QualifiedClassName: string = "";
    private m_ClassType: any = null;
    private m_ExposedAccessors: Map<string, Map<string, ExposedAccessor>> = new Map();

    constructor(structure: any) {
        // In TypeScript, we don't have flash.utils.describeType
        // This is a simplified implementation that doesn't use runtime reflection
        this.m_QualifiedClassName = structure.constructor?.name || "";
        this.m_ClassType = structure.constructor;
        this.m_ExposedAccessors.set(ExposedDefinition.EXPOSED_FOR_EDITOR, new Map());
        this.m_ExposedAccessors.set(ExposedDefinition.EXPOSED_FOR_LOAD, new Map());
        this.m_ExposedAccessors.set(ExposedDefinition.EXPOSED_FOR_SAVE, new Map());
        
        // NOTE: Runtime property discovery is not possible in TypeScript
        // Properties must be explicitly registered if needed
    }

    public get qualifiedClassName(): string {
        return this.m_QualifiedClassName;
    }

    public get classType(): any {
        return this.m_ClassType;
    }

    public FindExposedAccessor(propertyName: string, exposedFor: string): ExposedAccessor | null {
        const accessors = this.m_ExposedAccessors.get(exposedFor);
        if (accessors) {
            return accessors.get(propertyName) || null;
        }
        return null;
    }

    public GetAccessorsExposedFor(exposedFor: string): Map<string, ExposedAccessor> {
        return this.m_ExposedAccessors.get(exposedFor) || new Map();
    }

    public registerAccessor(propertyName: string, qualifiedClassName: string, exposedFor: string): void {
        const accessor = new ExposedAccessor(propertyName, qualifiedClassName);
        const accessors = this.m_ExposedAccessors.get(exposedFor);
        if (accessors) {
            accessors.set(propertyName, accessor);
        }
    }
}
