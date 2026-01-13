import { CreepType } from "./CreepType";

/**
 * Singleton manager for all creep types.
 */
export class CreepTypeManager {
    private static s_Instance: CreepTypeManager | null = null;
    
    private m_CreepTypes: CreepType[] = [];

    constructor() {
        this.m_CreepTypes = [];
    }

    public static get instance(): CreepTypeManager {
        CreepTypeManager.s_Instance = CreepTypeManager.s_Instance || new CreepTypeManager();
        return CreepTypeManager.s_Instance;
    }

    public RegisterCreepType(creepType: CreepType): void {
        if (this.m_CreepTypes.indexOf(creepType) === -1) {
            this.m_CreepTypes.push(creepType);
        }
    }

    public DeregisterCreepType(creepType: CreepType): void {
        const index = this.m_CreepTypes.indexOf(creepType);
        if (index !== -1) {
            this.m_CreepTypes.splice(index, 1);
        }
    }

    public AddExposedCreepTypes(data: { [key: string]: any }): void {
        const len = this.m_CreepTypes.length;
        for (let i = 0; i < len; i++) {
            const creepType = this.m_CreepTypes[i];
            if (data[creepType.id] != null) {
                creepType.dependent = data[creepType.id].dependent;
                creepType.type = data[creepType.id].type;
                creepType.movement = data[creepType.id].movement;
                creepType.pathing = data[creepType.id].pathing;
                creepType.blocked = data[creepType.id].blocked;
                creepType.classType = data[creepType.id].classType;
            }
            data[creepType.id] = creepType;
        }
    }
}
