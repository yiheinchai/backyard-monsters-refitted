import { ExposedDefinition } from "./ExposedDefinition";
import { ExposedObject } from "./ExposedObject";
import { ExposedObjectManager } from "./ExposedObjectManager";
import { Warning } from "../debug/Warning";

/**
 * ExposedCollection - A collection of ExposedObjects with lazy loading support.
 */
export class ExposedCollection extends ExposedObject {
    private m_Contents: Array<ExposedObject> = [];
    private m_CachedContentsState: any = null;
    private m_ContentsLoaded: boolean = true;

    constructor() {
        super();
        this.m_Contents = [];
        this.m_ContentsLoaded = this.AreContentsLoadedByDefault();
    }

    public get contentsLoaded(): boolean {
        return this.m_ContentsLoaded;
    }

    public set contentsLoaded(value: boolean) {
        this.m_ContentsLoaded = value;
    }

    public override Init(): void {
        super.Init();
        if (this.m_ContentsLoaded) {
            this.InitContents();
        }
    }

    public override Destroy(): void {
        this.UnloadContents(false);
        super.Destroy();
    }

    protected AreContentsLoadedByDefault(): boolean {
        return true;
    }

    protected SaveContentsSeperately(): boolean {
        return false;
    }

    public FindChildObject(id: string): ExposedObject | null {
        for (const obj of this.m_Contents) {
            if (obj.id === id) {
                return obj;
            }
        }
        return null;
    }

    public FindAndRemoveChildObject(id: string): ExposedObject | null {
        for (let i = 0; i < this.m_Contents.length; i++) {
            if (this.m_Contents[i].id === id) {
                return this.m_Contents.splice(i, 1)[0];
            }
        }
        return null;
    }

    public LoadContents(): void {
        if (this.m_ContentsLoaded) {
            Warning.Show("Trying to load the contents of collection with id '" + this.id + "', but its contents are already loaded.", ExposedCollection);
            return;
        }
        if (this.m_CachedContentsState === null) {
            Warning.Show("Trying to load the contents of collection with id '" + this.id + "', but it has no cached contents state.", ExposedCollection);
            return;
        }
        ExposedObjectManager.instance.BeginReferenceLoadingBlock();
        this.LoadContentsState(this.m_CachedContentsState, this.m_CachedContentsState.exposedFor);
        ExposedObjectManager.instance.EndReferenceLoadingBlock();
        this.InitContents();
        this.m_CachedContentsState = null;
        this.m_ContentsLoaded = true;
    }

    private InitContents(): void {
        for (const obj of this.m_Contents) {
            obj.Init();
        }
    }

    public UnloadContents(cache: boolean = true): void {
        if (cache) {
            this.m_CachedContentsState = this.SaveContentsState(ExposedDefinition.EXPOSED_FOR_SAVE);
            this.m_CachedContentsState.exposedFor = ExposedDefinition.EXPOSED_FOR_LOAD;
        }
        for (const obj of this.m_Contents) {
            ExposedObjectManager.instance.DeregisterReferenceableObject(obj);
            obj.Destroy();
        }
        this.m_Contents.length = 0;
        this.m_ContentsLoaded = false;
    }

    public SaveInitialContentsStateToXML(): any {
        return this.SaveContentsState(ExposedDefinition.EXPOSED_FOR_EDITOR);
    }

    public SavePersistedContentsStateToXML(): any {
        return this.SaveContentsState(ExposedDefinition.EXPOSED_FOR_SAVE);
    }

    public override LoadState(state: any, exposedFor: string): void {
        const wasLoaded = this.m_ContentsLoaded;
        super.LoadState(state, exposedFor);
        const contentsState = state?.contents;
        
        if (wasLoaded && this.m_ContentsLoaded) {
            this.LoadContentsState(contentsState, exposedFor);
        } else if (!wasLoaded && this.m_ContentsLoaded) {
            if (this.m_CachedContentsState !== null) {
                this.LoadContentsState(this.m_CachedContentsState, this.m_CachedContentsState.exposedFor);
                this.m_CachedContentsState = null;
            }
            this.LoadContentsState(contentsState, exposedFor);
        } else if (wasLoaded && !this.m_ContentsLoaded) {
            this.UnloadContents(false);
            this.m_CachedContentsState = { ...contentsState, exposedFor };
        } else {
            this.m_CachedContentsState = { ...contentsState, exposedFor };
        }
    }

    public override SaveState(exposedFor: string): any {
        const state = super.SaveState(exposedFor);
        state.nodeName = "collection";
        if (this.SaveContentsSeperately()) {
            return state;
        }
        if (this.m_ContentsLoaded) {
            state.contents = this.SaveContentsState(exposedFor);
        } else if (this.m_CachedContentsState !== null && this.m_CachedContentsState.exposedFor === exposedFor) {
            state.contents = { ...this.m_CachedContentsState };
        }
        return state;
    }

    private LoadContentsState(contentsState: any, exposedFor: string): void {
        if (!contentsState) return;
        
        const savedLength = contentsState.length || 0;
        const newContents: Array<ExposedObject> = [];
        
        const objects = contentsState.objects || [];
        for (const objState of objects) {
            const objId = objState.id || "";
            let obj = this.FindAndRemoveChildObject(objId);
            if (obj !== null) {
                obj.LoadState(objState, exposedFor);
                newContents.push(obj);
            } else {
                // In TypeScript, we can't dynamically create classes by name
                // This would need a factory pattern or registry
                Warning.Show("Cannot create object of type '" + objState.type + "' dynamically in TypeScript.", ExposedCollection);
            }
        }

        // Destroy remaining old contents
        for (const obj of this.m_Contents) {
            obj.Destroy();
        }
        this.m_Contents = newContents;
    }

    private SaveContentsState(exposedFor: string): any {
        const state: any = {
            length: this.m_Contents.length,
            objects: []
        };
        for (const obj of this.m_Contents) {
            state.objects.push(obj.SaveState(exposedFor));
        }
        return state;
    }
}
