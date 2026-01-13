import { SingletonLock } from "../../config/singletonlock/SingletonLock";
import { ExposedDefinition } from "./ExposedDefinition";
import { ExposedObject } from "./ExposedObject";
import { ExposedReference } from "./ExposedReference";
import { ExposedCollection } from "./ExposedCollection";
import { Warning } from "../debug/Warning";

/**
 * ExposedObjectManager - Manages referenceable objects and resolves references (singleton).
 */
export class ExposedObjectManager {
    private static s_Instance: ExposedObjectManager | null = null;

    private m_ReferenceableObjects: Map<string, ExposedObject> = new Map();
    private m_ReferencesToResolve: Array<ExposedReference> = [];
    private m_ReferenceLoadingBlockCounter: number = 0;

    constructor(_lock: SingletonLock) {}

    public static get instance(): ExposedObjectManager {
        if (ExposedObjectManager.s_Instance === null) {
            ExposedObjectManager.s_Instance = new ExposedObjectManager(new SingletonLock());
        }
        return ExposedObjectManager.s_Instance;
    }

    public LoadExposedCollection(editorState: any, loadState: any = null): ExposedCollection {
        const collection = new ExposedCollection();
        this.BeginReferenceLoadingBlock();
        collection.LoadState(editorState, ExposedDefinition.EXPOSED_FOR_EDITOR);
        if (loadState !== null) {
            collection.LoadState(loadState, ExposedDefinition.EXPOSED_FOR_LOAD);
        }
        this.EndReferenceLoadingBlock();
        collection.Init();
        return collection;
    }

    public RegisterReferenceableObject(obj: ExposedObject): void {
        if (this.m_ReferenceableObjects.has(obj.id)) {
            Warning.Show("Trying to register referenceable object '" + obj.id + "' that has already been registered.", ExposedObjectManager);
            return;
        }
        this.m_ReferenceableObjects.set(obj.id, obj);
    }

    public DeregisterReferenceableObject(obj: ExposedObject): void {
        this.m_ReferenceableObjects.delete(obj.id);
    }

    public FindReferenceableObject(id: string): ExposedObject | null {
        return this.m_ReferenceableObjects.get(id) || null;
    }

    public BeginReferenceLoadingBlock(): void {
        this.m_ReferenceLoadingBlockCounter++;
    }

    public EndReferenceLoadingBlock(): void {
        this.m_ReferenceLoadingBlockCounter--;
        if (this.m_ReferenceLoadingBlockCounter < 0) {
            Warning.Show("Reference loading block mis-match.", ExposedObjectManager);
            this.m_ReferenceLoadingBlockCounter = 0;
        }
        if (this.m_ReferenceLoadingBlockCounter === 0) {
            this.ResolveReferences();
        }
    }

    public AddReferenceToResolve(ref: ExposedReference): void {
        if (this.m_ReferenceLoadingBlockCounter <= 0) {
            Warning.Show("AddReferenceToResolve called outside of a reference loading block.", ExposedObjectManager);
            return;
        }
        this.m_ReferencesToResolve.push(ref);
    }

    private ResolveReferences(): void {
        for (const ref of this.m_ReferencesToResolve) {
            if (!ref.referencedObjectId || ref.referencedObjectId === "") {
                (ref.exposedStructure as any)[ref.exposedAccessor!.name] = null;
                ref.Destroy();
            } else {
                const obj = this.FindReferenceableObject(ref.referencedObjectId);
                if (obj === null) {
                    Warning.Show("Resolving reference '" + ref.referencedObjectId + "' for accessor '" + ref.exposedAccessor!.name + "' but we couldn't find the referenced object.", ExposedObjectManager);
                    (ref.exposedStructure as any)[ref.exposedAccessor!.name] = null;
                    ref.Destroy();
                } else if (ref.vectorIndex >= 0) {
                    const arr = (ref.exposedStructure as any)[ref.exposedAccessor!.name];
                    if (ref.vectorIndex >= arr.length) {
                        Warning.Show("Resolving reference at index '" + ref.vectorIndex + "' that is greater than length '" + arr.length + "'.", ExposedObjectManager);
                        arr[ref.vectorIndex] = null;
                    } else {
                        arr[ref.vectorIndex] = obj;
                    }
                    ref.Destroy();
                } else {
                    (ref.exposedStructure as any)[ref.exposedAccessor!.name] = obj;
                    ref.Destroy();
                }
            }
        }
        this.m_ReferencesToResolve.length = 0;
    }
}
