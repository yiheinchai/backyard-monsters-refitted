import { ExposedAccessor } from "./ExposedAccessor";
import { ExposedStructure } from "./ExposedStructure";

/**
 * ExposedReference - Holds a reference to be resolved after loading.
 */
export class ExposedReference {
    private m_ExposedStructure: ExposedStructure | null;
    private m_ExposedAccessor: ExposedAccessor | null;
    private m_ReferencedObjectId: string;
    private m_VectorIndex: number;

    constructor(structure: ExposedStructure, accessor: ExposedAccessor, objectId: string, vectorIndex: number = -1) {
        this.m_ExposedStructure = structure;
        this.m_ExposedAccessor = accessor;
        this.m_ReferencedObjectId = objectId;
        this.m_VectorIndex = vectorIndex;
    }

    public get exposedStructure(): ExposedStructure | null {
        return this.m_ExposedStructure;
    }

    public get exposedAccessor(): ExposedAccessor | null {
        return this.m_ExposedAccessor;
    }

    public get referencedObjectId(): string {
        return this.m_ReferencedObjectId;
    }

    public get vectorIndex(): number {
        return this.m_VectorIndex;
    }

    public Destroy(): void {
        this.m_ExposedStructure = null;
        this.m_ExposedAccessor = null;
        this.m_ReferencedObjectId = "";
        this.m_VectorIndex = -1;
    }
}
