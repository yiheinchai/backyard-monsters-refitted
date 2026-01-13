/**
 * ExposedAccessor - Holds information about an exposed property accessor.
 */
export class ExposedAccessor {
    private m_Name: string;
    private m_QualifiedClassName: string;
    private m_ClassType: any;

    constructor(name: string, qualifiedClassName: string) {
        this.m_Name = name;
        this.m_QualifiedClassName = qualifiedClassName;
        // In TypeScript, we can't dynamically get class by name like Flash
        this.m_ClassType = null;
    }

    public get name(): string {
        return this.m_Name;
    }

    public get qualifiedClassName(): string {
        return this.m_QualifiedClassName;
    }

    public get classType(): any {
        return this.m_ClassType;
    }

    public Destroy(): void {
        this.m_Name = "";
        this.m_QualifiedClassName = "";
        this.m_ClassType = null;
    }
}
