/**
 * Manages object instances and their lifecycle.
 * Tracks instances by class type with inheritance support.
 */
export class InstanceManager {
    public static readonly k_ClassDisposalMethod: string = "Clean";
    
    protected static k_Inheritance: Map<any, any> = new Map();
    protected static k_Instances: Map<any, any[]> = new Map();

    constructor() {}

    /**
     * Creates a new instance of the given class and registers it.
     */
    public static getInstance<T>(classType: new () => T): T {
        const instance = new classType();
        InstanceManager.addInstance(instance);
        return instance;
    }

    /**
     * Gets all instances of a given class type.
     */
    public static getInstancesByClass<T>(classType: new (...args: any[]) => T): T[] {
        const instances = InstanceManager.k_Instances.get(classType);
        return instances ? instances as T[] : [];
    }

    /**
     * Clears a specific instance and calls its disposal method.
     */
    public static clearInstance(instance: any): void {
        let classType = instance.constructor;
        
        while (classType != null && classType !== Object) {
            const instances = InstanceManager.k_Instances.get(classType);
            if (instances) {
                const idx = instances.indexOf(instance);
                if (idx !== -1) {
                    instances.splice(idx, 1);
                }
            }
            
            const parent = InstanceManager.k_Inheritance.get(classType);
            if (parent !== undefined) {
                classType = parent;
            } else {
                break;
            }
        }
        
        if (instance[InstanceManager.k_ClassDisposalMethod] && 
            typeof instance[InstanceManager.k_ClassDisposalMethod] === "function") {
            instance[InstanceManager.k_ClassDisposalMethod].call(instance);
        }
    }

    /**
     * Clears all instances, calling disposal methods where available.
     */
    public static clearAll(): void {
        for (const [classType, instances] of InstanceManager.k_Instances) {
            for (let i = instances.length - 1; i >= 0; i--) {
                const instance = instances[i];
                if (instance.constructor === classType &&
                    instance[InstanceManager.k_ClassDisposalMethod] &&
                    typeof instance[InstanceManager.k_ClassDisposalMethod] === "function") {
                    instance[InstanceManager.k_ClassDisposalMethod].call(instance);
                }
            }
            InstanceManager.k_Instances.set(classType, []);
        }
    }

    /**
     * Adds an existing instance to be tracked.
     */
    public static addInstance(instance: any): void {
        let classType = instance.constructor;
        
        while (classType != null && classType !== Object) {
            if (!InstanceManager.k_Instances.has(classType)) {
                InstanceManager.k_Instances.set(classType, []);
            }
            InstanceManager.k_Instances.get(classType)!.push(instance);
            
            const parent = InstanceManager.k_Inheritance.get(classType);
            if (parent !== undefined) {
                classType = parent;
            } else {
                // Get parent class
                const proto = Object.getPrototypeOf(classType.prototype);
                const parentClass = proto ? proto.constructor : null;
                if (parentClass && parentClass !== Object) {
                    InstanceManager.k_Inheritance.set(classType, parentClass);
                    classType = parentClass;
                } else {
                    InstanceManager.k_Inheritance.set(classType, null);
                    break;
                }
            }
        }
    }

    /**
     * Removes an instance from tracking without calling disposal.
     */
    public static removeInstance(instance: any): void {
        let classType = instance.constructor;
        
        while (classType != null && classType !== Object) {
            const instances = InstanceManager.k_Instances.get(classType);
            if (instances) {
                const idx = instances.indexOf(instance);
                if (idx !== -1) {
                    instances.splice(idx, 1);
                }
            }
            
            const parent = InstanceManager.k_Inheritance.get(classType);
            if (parent !== undefined) {
                classType = parent;
            } else {
                break;
            }
        }
    }

    /**
     * Removes all instances without calling disposal methods.
     */
    public static removeAll(): void {
        for (const classType of InstanceManager.k_Instances.keys()) {
            InstanceManager.k_Instances.set(classType, []);
        }
    }
}
