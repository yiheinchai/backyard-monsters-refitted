import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import MovieClip from "openfl/display/MovieClip";
import MouseEvent from "openfl/events/MouseEvent";

import { SecNum } from "../../cc/utils/SecNum";
import { InstanceManager } from "../managers/InstanceManager";
import { TRIBES } from "./TRIBES";

import { ATTACK } from "../../../ATTACK";
import { BASE } from "../../../BASE";
import { BFOUNDATION } from "../../../BFOUNDATION";
import { BUILDING14 } from "../../../BUILDING14";
import { BUILDING15 } from "../../../BUILDING15";
import { CREATURELOCKER } from "../../../CREATURELOCKER";
import { CREATURES } from "../../../CREATURES";
import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { MAPROOM_DESCENT } from "../../../MAPROOM_DESCENT";
import { QUESTS } from "../../../QUESTS";

// Declare popup classes
declare class popup_aibase_success extends MovieClip {
    body_txt: any;
    b1: any;
    b2: any;
    title_txt: any;
    headline_txt: any;
    Resize: () => void;
}
declare class popup_aibase_failure extends MovieClip {
    body_txt: any;
    b1: any;
    title_txt: any;
    headline_txt: any;
    Resize: () => void;
}

interface WMBaseData {
    baseid: number;
    tribe: any;
    level: number;
    destroyed: number;
}

/**
 * Wild Monster base management and attack logic.
 */
export class WMBASE {
    public static _popup: MovieClip | null = null;
    public static _bases: WMBaseData[] = [];
    public static _descentBases: WMBaseData[] = [];
    private static setupStatus: number = 0;
    private static callbacks: Function[] = [];
    public static _repairDelay: number = 7200;
    public static _startTime: number = 0;
    private static repairing: boolean = false;
    public static _mc: MovieClip | null = null;
    public static _type: number = 0;
    public static _destroyed: boolean = false;
    private static juiceQ: number = 3;
    private static tick: number = 0;
    private static _descentMode: boolean = false;

    constructor() {}

    public static Setup(): void {
        WMBASE._mc = null;
        WMBASE._destroyed = false;
        WMBASE._startTime = GLOBAL.Timestamp();
        WMBASE.repairing = true;
        
        const buildings = InstanceManager.getInstancesByClass(BFOUNDATION) as BFOUNDATION[];
        for (const building of buildings) {
            if (building.health < building.maxHealth && (building as any)._repairing !== 1) {
                WMBASE.repairing = false;
            }
        }
        
        for (let i = 0; i < 6; i++) {
            GLOBAL._mapWidth *= 1.1;
            GLOBAL._mapHeight *= 1.1;
            GLOBAL._mapWidth = Math.ceil(GLOBAL._mapWidth / 20) * 20;
            GLOBAL._mapHeight = Math.ceil(GLOBAL._mapHeight / 20) * 20;
        }
        
        if (BASE.isInfernoMainYardOrOutpost && BASE._wmID || GLOBAL.InfernoMode(GLOBAL._loadmode)) {
            return;
        }
        
        const tribe = TRIBES.TribeForBaseID(BASE._wmID);
        if (tribe && (tribe as any).behaviour === "juice") {
            GLOBAL._hatcheryOverdrivePower = new SecNum(10);
        }
    }

    public static Clear(): void {
        WMBASE._bases = [];
        WMBASE._destroyed = false;
        WMBASE._descentMode = false;
    }

    public static Data(data: any[]): void {
        WMBASE._descentMode = false;
        if (GLOBAL.mode === GLOBAL.e_BASE_MODE.BUILD && data) {
            WMBASE._bases = [];
            for (const item of data) {
                const baseData: WMBaseData = {
                    baseid: item[0],
                    tribe: TRIBES.TribeForBaseID(item[0]),
                    level: item[1],
                    destroyed: item[2]
                };
                WMBASE._bases.push(baseData);
            }
            WMBASE._bases.sort((a, b) => a.level - b.level);
            WMBASE.CheckQuests();
        }
    }

    public static DescentData(data: any[]): void {
        WMBASE._descentMode = true;
        if (GLOBAL.mode === GLOBAL.e_BASE_MODE.BUILD && data) {
            let level = 1;
            WMBASE._descentBases = [];
            for (const item of data) {
                const baseData: WMBaseData = {
                    baseid: item[0],
                    tribe: MAPROOM_DESCENT._descentTribe,
                    level: item[1],
                    destroyed: item[2]
                };
                WMBASE._descentBases.push(baseData);
                if (baseData.destroyed === 1) {
                    level++;
                }
            }
            WMBASE._descentBases.sort((a, b) => a.level - b.level);
            GLOBAL.StatSet("descentLvl", level);
            MAPROOM_DESCENT._descentLvl = level;
        }
    }

    public static AttackerForType(type: number): any {
        const bases = WMBASE.ChooseBase();
        for (const base of bases) {
            if (base.tribe && base.tribe.type === type) {
                return base.tribe;
            }
        }
        return {};
    }

    public static TypeForAttackerName(name: string): number {
        return 0;
    }

    public static Tick(): void {
        let buildings: BFOUNDATION[] | null = null;
        
        if (!WMBASE.repairing) {
            if (GLOBAL.Timestamp() > WMBASE._startTime + WMBASE._repairDelay) {
                buildings = InstanceManager.getInstancesByClass(BFOUNDATION) as BFOUNDATION[];
                for (const building of buildings) {
                    if (building.health < building.maxHealth && (building as any)._repairing === 0) {
                        building.Repair();
                    }
                }
                WMBASE.repairing = true;
            }
        }
        
        if (!GLOBAL._catchup && GLOBAL._bJuicer) {
            const tribe = TRIBES.TribeForBaseID(BASE._wmID);
            if (WMBASE.tick % WMBASE.juiceQ === 0 && 
                tribe && (tribe as any).behaviour === "juice" && 
                GLOBAL._bJuicer.health > 0.5 * GLOBAL._bJuicer.maxHealth && 
                GLOBAL.townHall.health > 0) {
                
                if (!buildings) {
                    buildings = InstanceManager.getInstancesByClass(BFOUNDATION) as BFOUNDATION[];
                }
                for (const building of buildings) {
                    if ((building as any)._type === 13 && (building as any)._canFunction && (building as any)._inProduction !== "C1") {
                        (building as any)._inProduction = "C1";
                        (building as any)._productionStage.Set(3);
                    }
                }
            }
            WMBASE.tick++;
        }
    }

    public static ResetAll(): void {
        for (const base of WMBASE._bases) {
            base.destroyed = 0;
        }
        for (const base of WMBASE._descentBases) {
            base.destroyed = 0;
        }
    }

    public static DestroyAllDescent(): void {
        for (const base of WMBASE._descentBases) {
            base.destroyed = 1;
        }
    }

    public static JuiceOne(): void {
        const hatcheries: BFOUNDATION[] = [];
        const buildings = InstanceManager.getInstancesByClass(BUILDING15) as BFOUNDATION[];
        for (const building of buildings) {
            hatcheries.push(building);
        }
        
        let creatureId: string | null = null;
        const monsterCount = GLOBAL.player.monsterList.length;
        for (let i = 0; i < monsterCount; i++) {
            if (GLOBAL.player.monsterList[i].numCreeps > 0) {
                creatureId = GLOBAL.player.monsterList[i].m_creatureID;
            }
        }
        
        if (creatureId && GLOBAL._bJuicer && GLOBAL._bJuicer.health > 0.5 * GLOBAL._bJuicer.maxHealth) {
            GLOBAL.player.monsterListByID(creatureId).add(-1);
            for (const creature of Object.values(CREATURES._creatures)) {
                if ((creature as any)._creatureID === creatureId && (creature as any)._behaviour !== "juice") {
                    (creature as any).ModeJuice();
                    return;
                }
            }
        }
    }

    public static CheckQuests(): void {
        const bases = WMBASE.ChooseBase();
        for (const base of bases) {
            if (base.destroyed === 1) {
                if (GLOBAL.mode === GLOBAL.e_BASE_MODE.BUILD) {
                    let index = 0;
                    if (base.tribe && base.tribe.id !== undefined) {
                        index = base.tribe.id;
                    }
                    QUESTS.Check("destroy_tribe" + index, 1);
                }
            }
        }
    }

    public static CheckDescentProgress(): number {
        let level = 1;
        if (WMBASE._descentBases) {
            for (const base of WMBASE._descentBases) {
                if (base.destroyed === 1) {
                    level++;
                }
            }
        }
        return level;
    }

    public static Export(): WMBaseData[] {
        return WMBASE.ChooseBase();
    }

    public static TownHallDestroyed(): void {
        // Simplified - would need popup implementation
        WMBASE._destroyed = true;
        ATTACK.End();
    }

    private static BaseForID(id: number): WMBaseData | { tribe?: any } {
        const bases = WMBASE.ChooseBase();
        for (const base of bases) {
            if (base.baseid === id) {
                return base;
            }
        }
        return {};
    }

    private static skipDown(event: MouseEvent | null = null): void {
        if (WMBASE._mc && WMBASE._mc.parent) {
            WMBASE._mc.parent.removeChild(WMBASE._mc);
        }
        WMBASE._mc = null;
        ATTACK.End();
    }

    public static End(): void {
        if (!GLOBAL._catchup && GLOBAL.mode === GLOBAL.e_BASE_MODE.WMATTACK) {
            const townHalls = InstanceManager.getInstancesByClass(BUILDING14) as BFOUNDATION[];
            for (const th of townHalls) {
                if (th.health === 0 && (th as any)._repairing === 0 && GLOBAL.mode === GLOBAL.e_BASE_MODE.WMATTACK) {
                    WMBASE.TownHallDestroyed();
                    return;
                }
            }
        }
        WMBASE.AttackFailed();
    }

    public static AttackFailed(): void {
        WMBASE._destroyed = false;
        // Simplified - full implementation would show popup
        ATTACK.End();
    }

    public static ShowMapAgain(): void {
        ATTACK.EndB();
    }

    private static ChooseBase(): WMBaseData[] {
        if (WMBASE._descentMode) {
            return WMBASE._descentBases;
        } else if (GLOBAL.mode === GLOBAL.e_BASE_MODE.BUILD) {
            return WMBASE._bases;
        } else {
            return WMBASE._bases;
        }
    }
}
