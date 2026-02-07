import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import MovieClip from "openfl/display/MovieClip";
import MouseEvent from "openfl/events/MouseEvent";

import { SecNum } from "../../cc/utils/SecNum";
import { TRIBES } from "./TRIBES";

import { MAPROOM_DESCENT } from "../../../MAPROOM_DESCENT";
import { popup_aibase_success } from "../../../popup_aibase_success";
import { popup_aibase_failure } from "../../../popup_aibase_failure";

// Lazy imports to break circular dependency chains
function getInstanceManager(): any { return require("../managers/InstanceManager").InstanceManager; }
function getATTACK(): any { return require("../../../ATTACK").ATTACK; }
function getBASE(): any { return require("../../../BASE").BASE; }
function getBFOUNDATION(): any { return require("../../../BFOUNDATION").BFOUNDATION; }
function getBUILDING14(): any { return require("../../../BUILDING14").BUILDING14; }
function getBUILDING15(): any { return require("../../../BUILDING15").BUILDING15; }
function getCREATURELOCKER(): any { return require("../../../CREATURELOCKER").CREATURELOCKER; }
function getCREATURES(): any { return require("../../../CREATURES").CREATURES; }
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../KEYS").KEYS; }
function getQUESTS(): any { return require("../../../QUESTS").QUESTS; }


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
        WMBASE._startTime = getGLOBAL().Timestamp();
        WMBASE.repairing = true;
        
        const buildings = getInstanceManager().getInstancesByClass(BFOUNDATION) as BFOUNDATION[];
        for (const building of buildings) {
            if (building.health < building.maxHealth && (building as any)._repairing !== 1) {
                WMBASE.repairing = false;
            }
        }
        
        for (let i = 0; i < 6; i++) {
            getGLOBAL()._mapWidth *= 1.1;
            getGLOBAL()._mapHeight *= 1.1;
            getGLOBAL()._mapWidth = Math.ceil(getGLOBAL()._mapWidth / 20) * 20;
            getGLOBAL()._mapHeight = Math.ceil(getGLOBAL()._mapHeight / 20) * 20;
        }
        
        if (getBASE().isInfernoMainYardOrOutpost && getBASE()._wmID || getGLOBAL().InfernoMode(getGLOBAL()._loadmode)) {
            return;
        }
        
        const tribe = TRIBES.TribeForBaseID(getBASE()._wmID);
        if (tribe && (tribe as any).behaviour === "juice") {
            getGLOBAL()._hatcheryOverdrivePower = new SecNum(10);
        }
    }

    public static Clear(): void {
        WMBASE._bases = [];
        WMBASE._destroyed = false;
        WMBASE._descentMode = false;
    }

    public static Data(data: any[]): void {
        WMBASE._descentMode = false;
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD && data) {
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
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD && data) {
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
            getGLOBAL().StatSet("descentLvl", level);
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
            if (getGLOBAL().Timestamp() > WMBASE._startTime + WMBASE._repairDelay) {
                buildings = getInstanceManager().getInstancesByClass(BFOUNDATION) as BFOUNDATION[];
                for (const building of buildings) {
                    if (building.health < building.maxHealth && (building as any)._repairing === 0) {
                        building.Repair();
                    }
                }
                WMBASE.repairing = true;
            }
        }
        
        if (!getGLOBAL()._catchup && getGLOBAL()._bJuicer) {
            const tribe = TRIBES.TribeForBaseID(getBASE()._wmID);
            if (WMBASE.tick % WMBASE.juiceQ === 0 && 
                tribe && (tribe as any).behaviour === "juice" && 
                getGLOBAL()._bJuicer.health > 0.5 * getGLOBAL()._bJuicer.maxHealth && 
                getGLOBAL().townHall.health > 0) {
                
                if (!buildings) {
                    buildings = getInstanceManager().getInstancesByClass(BFOUNDATION) as BFOUNDATION[];
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
        const buildings = getInstanceManager().getInstancesByClass(BUILDING15) as BFOUNDATION[];
        for (const building of buildings) {
            hatcheries.push(building);
        }
        
        let creatureId: string | null = null;
        const monsterCount = getGLOBAL().player.monsterList.length;
        for (let i = 0; i < monsterCount; i++) {
            if (getGLOBAL().player.monsterList[i].numCreeps > 0) {
                creatureId = getGLOBAL().player.monsterList[i].m_creatureID;
            }
        }
        
        if (creatureId && getGLOBAL()._bJuicer && getGLOBAL()._bJuicer.health > 0.5 * getGLOBAL()._bJuicer.maxHealth) {
            getGLOBAL().player.monsterListByID(creatureId).add(-1);
            for (const creature of Object.values(getCREATURES()._creatures)) {
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
                if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
                    let index = 0;
                    if (base.tribe && base.tribe.id !== undefined) {
                        index = base.tribe.id;
                    }
                    getQUESTS().Check("destroy_tribe" + index, 1);
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
        getATTACK().End();
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
        getATTACK().End();
    }

    public static End(): void {
        if (!getGLOBAL()._catchup && getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMATTACK) {
            const townHalls = getInstanceManager().getInstancesByClass(BUILDING14) as BFOUNDATION[];
            for (const th of townHalls) {
                if (th.health === 0 && (th as any)._repairing === 0 && getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMATTACK) {
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
        getATTACK().End();
    }

    public static ShowMapAgain(): void {
        getATTACK().EndB();
    }

    private static ChooseBase(): WMBaseData[] {
        if (WMBASE._descentMode) {
            return WMBASE._descentBases;
        } else if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
            return WMBASE._bases;
        } else {
            return WMBASE._bases;
        }
    }
}
