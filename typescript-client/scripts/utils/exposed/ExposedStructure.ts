import { ExposedDefinition } from "./ExposedDefinition";
import { ExposedDefinitionManager } from "./ExposedDefinitionManager";
import { Warning } from "../debug/Warning";

/**
 * ExposedStructure - Base class for data structures that can be serialized/deserialized.
 * NOTE: This is a simplified TypeScript version. Flash-specific reflection is not available.
 */
export class ExposedStructure {
    private static readonly REFERENCE_TYPE_TEMPLATE_NAME: string = "utils.exposed::ExposedReference.<";
    private static readonly VECTOR_TYPE_TEMPLATE_NAME: string = "__AS3__.vec::Vector.<";

    protected m_Definition: ExposedDefinition | null = null;

    constructor() {
        this.m_Definition = ExposedDefinitionManager.instance.FindOrCacheExposedDefinition(this);
    }

    protected _Init(): void {}

    protected _Destroy(): void {}

    public Init(): void {
        // In TypeScript, we don't have runtime reflection like Flash's describeType
        // Subclasses should override this to initialize their properties
        this._Init();
    }

    public Destroy(): void {
        if (this.m_Definition === null) {
            return;
        }
        this._Destroy();
        this.m_Definition = null;
    }

    public SaveInitialStateToXML(): any {
        return this.SaveState(ExposedDefinition.EXPOSED_FOR_EDITOR);
    }

    public SavePersistedStateToXML(): any {
        return this.SaveState(ExposedDefinition.EXPOSED_FOR_SAVE);
    }

    public LoadState(state: any, exposedFor: string): void {
        // Simplified implementation - subclasses should override
        if (!state) return;
        
        if (state.type && this.m_Definition && state.type !== this.m_Definition.qualifiedClassName) {
            Warning.Show("Loading structure of type '" + this.m_Definition.qualifiedClassName + "' with state of type '" + state.type + "'.", ExposedStructure);
        }

        // Load properties from state object
        if (state.properties) {
            for (const prop of state.properties) {
                const propName = prop.name;
                if (propName && propName in (this as any)) {
                    (this as any)[propName] = prop.value;
                }
            }
        }
    }

    public SaveState(exposedFor: string): any {
        const state: any = {
            type: this.m_Definition?.qualifiedClassName || "",
            properties: []
        };
        
        // Subclasses should override to save their properties
        return state;
    }
}
