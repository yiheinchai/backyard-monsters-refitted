import { BaseBuff } from "./BaseBuff";

// Forward declarations for buff types
declare class TowerDamageBuff extends BaseBuff { static ID: number; }
declare class BuildingDefenseBuff extends BaseBuff { static ID: number; }
declare class MonsterDamageBuff extends BaseBuff { static ID: number; }
declare class MonsterAttackDamageBuff extends BaseBuff { static ID: number; }
declare class MonsterDefenseDamageBuff extends BaseBuff { static ID: number; }
declare class AllianceArmamentBuff extends BaseBuff { static ID: number; }
declare class AllianceConquestBuff extends BaseBuff { static ID: number; }
declare class ResourceCapacityBaseBuff extends BaseBuff { static ID: number; }
declare class AutoBankBaseBuff extends BaseBuff { static ID: number; }
declare class AllianceDeclareWarBuff extends BaseBuff { static ID: number; }
declare class Console { static print(msg: string): void; }

/**
 * Buff data - wrapper for buff type and state.
 */
class BuffData {
    public type: new () => BaseBuff;
    public state: string;

    constructor(type: new () => BaseBuff, state: string = "") {
        this.type = type;
        if (!state) {
            state = BaseBuffLibrary.k_DEFENDING;
        }
        this.state = state;
    }
}

/**
 * Base buff library - registry for all base buff types.
 */
export class BaseBuffLibrary {
    public static readonly k_ATTACKING: string = "attacking";
    public static readonly k_DEFENDING: string = "defending";

    private static m_buffTypes: { [key: number]: any } = {};

    constructor() {}

    public static initialize(): void {
        BaseBuffLibrary.addBaseBuff(TowerDamageBuff.ID, new BuffData(TowerDamageBuff));
        BaseBuffLibrary.addBaseBuff(BuildingDefenseBuff.ID, new BuffData(BuildingDefenseBuff));
        BaseBuffLibrary.addBaseBuff(MonsterDamageBuff.ID, new BuffData(MonsterAttackDamageBuff, BaseBuffLibrary.k_ATTACKING), new BuffData(MonsterDefenseDamageBuff, BaseBuffLibrary.k_DEFENDING));
        BaseBuffLibrary.addBaseBuff(AllianceArmamentBuff.ID, new BuffData(AllianceArmamentBuff));
        BaseBuffLibrary.addBaseBuff(AllianceConquestBuff.ID, new BuffData(AllianceConquestBuff));
        BaseBuffLibrary.addBaseBuff(ResourceCapacityBaseBuff.ID, new BuffData(ResourceCapacityBaseBuff));
        BaseBuffLibrary.addBaseBuff(AutoBankBaseBuff.ID, new BuffData(AutoBankBaseBuff));
        BaseBuffLibrary.addBaseBuff(AllianceDeclareWarBuff.ID, new BuffData(AllianceDeclareWarBuff));
    }

    private static addBaseBuff(id: number, ...buffDatas: BuffData[]): void {
        if (BaseBuffLibrary.m_buffTypes[id]) {
            Console.print("You tried to add the BaseBuff(" + id + ") that already exists");
            return;
        }
        
        const stateMap: any = [];
        for (let i = 0; i < buffDatas.length; i++) {
            const buffData = buffDatas[i];
            stateMap[buffData.state] = buffData;
        }
        BaseBuffLibrary.m_buffTypes[id] = stateMap;
    }

    public static getBuffByID(id: number, state: string = ""): BaseBuff | null {
        if (!state) {
            state = BaseBuffLibrary.k_DEFENDING;
        }
        
        const buffArray = BaseBuffLibrary.m_buffTypes[id];
        if (buffArray) {
            const buffData = buffArray[state] as BuffData;
            if (buffData) {
                const buff = new buffData.type() as BaseBuff;
                buff.id = id;
                return buff;
            }
        }
        
        Console.print("There is no BassBuff in the BaseBuffLibrary with an id of " + id + " for the state " + state);
        return null;
    }
}
