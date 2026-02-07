import { BYMConfig } from './com/monsters/configs/BYMConfig';
import { CreepEvent } from './com/monsters/events/CreepEvent';
import { ChampionBase } from './com/monsters/monsters/champions/ChampionBase';
import { CreepBase } from './com/monsters/monsters/creeps/CreepBase';
import Point from 'openfl/geom/Point';

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("./com/monsters/monsters/MonsterBase").MonsterBase; }
function getBFOUNDATION(): any { return require("./BFOUNDATION").BFOUNDATION; }
function getCHAMPIONCAGE(): any { return require("./CHAMPIONCAGE").CHAMPIONCAGE; }
function getCREATURELOCKER(): any { return require("./CREATURELOCKER").CREATURELOCKER; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getMAP(): any { return require("./MAP").MAP; }
function getSPECIALEVENT(): any { return require("./SPECIALEVENT").SPECIALEVENT; }


/**
 * CREATURES - Defending Monster Management System
 * Handles spawning and management of defending creatures
 */
export class CREATURES {
    public static _creatures: Record<string, MonsterBase> = {};
    public static _creatureID: number = 0;
    public static _creatureCount: number = 0;
    public static _ticks: number = 0;
    public static _guardianList: ChampionBase[] = [];

    constructor() {
        CREATURES._creatures = {};
        CREATURES._creatureID = 0;
        CREATURES._creatureCount = 0;
        CREATURES._ticks = 0;
        CREATURES._guardianList.length = 0;
    }

    public static GetProperty(monsterID: string, statID: string, level: number = 0, friendly: boolean = true): number {
        if (!monsterID || monsterID.substr(0, 1) === "G") {
            return 0;
        }
        try {
            if (monsterID === "C100") {
                monsterID = "C12";
            }
            if (!getGLOBAL().player.m_upgrades[monsterID]) {
                getGLOBAL().player.m_upgrades[monsterID] = { level: 1 };
            }
            const stat: number[] = getCREATURELOCKER()._creatures[monsterID].props[statID];
            if (!stat) {
                return 0;
            }
            let checkID: string = monsterID;
            if (getCREATURELOCKER()._creatures[checkID].dependent) {
                checkID = getCREATURELOCKER()._creatures[checkID].dependent;
            }
            if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.ATTACK || getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMATTACK || !friendly) {
                if (level === 0) {
                    if (!friendly && getGLOBAL().attackingPlayer) {
                        if (getGLOBAL().attackingPlayer.m_upgrades[checkID] != null) {
                            level = getGLOBAL().attackingPlayer.m_upgrades[checkID].level;
                        }
                    } else if (getGLOBAL().player.m_upgrades[checkID] != null) {
                        level = getGLOBAL().player.m_upgrades[checkID].level;
                    }
                }
            } else if (level === 0 && getGLOBAL().player.m_upgrades[checkID] != null) {
                const activeEvent = getSPECIALEVENT().getActiveSpecialEvent();
                if (activeEvent.active && !friendly) {
                    level = getGLOBAL()._wmCreatureLevels[monsterID];
                }
                level = getGLOBAL().player.m_upgrades[checkID].level;
            }
            if (stat.length < level) {
                level = stat.length;
            }
            return stat[level - 1];
        } catch (e) {
            return 0;
        }
    }

    public static Tick(): void {
        for (const key in CREATURES._creatures) {
            const creature: MonsterBase = CREATURES._creatures[key];
            if (creature.tick()) {
                if (!creature.dying || creature.juiceReady) {
                    creature.die();
                    if (!creature.isDisposable && getGLOBAL().player.monsterListByID(creature._creatureID)) {
                        getGLOBAL().player.monsterListByID(creature._creatureID).unlinkCreepFromData(creature);
                    }
                }
                if (creature.dead) {
                    if (!BYMConfig.instance.RENDERER_ON) {
                        getMAP()._BUILDINGTOPS.removeChild(creature.graphic);
                    }
                    --CREATURES._creatureCount;
                    delete CREATURES._creatures[key];
                }
            }
        }
        if (CREATURES._creatureCount <= 0) {
            CREATURES._creatureCount = 0;
        }
    }

    public static Spawn(creatureId: string, parent: any, behaviour: string, pos: Point, rotation: number, 
                        targetPos: Point | null = null, targetBuilding: BFOUNDATION | null = null, 
                        level: number = 0, health: number = Number.MAX_SAFE_INTEGER): MonsterBase | null {
        if (!getCREATURELOCKER()._creatures[creatureId]) {
            return null;
        }
        ++CREATURES._creatureID;
        ++CREATURES._creatureCount;
        let CreatureClass = getCREATURELOCKER()._creatures[creatureId].classType;
        if (!CreatureClass) {
            CreatureClass = CreepBase;
        }
        const creature: MonsterBase = new CreatureClass(creatureId, behaviour, pos, rotation, level, health, targetPos, true, targetBuilding, 1, false, null);
        if (!BYMConfig.instance.RENDERER_ON) {
            parent.addChild(creature.graphic);
        }
        CREATURES._creatures[CREATURES._creatureID] = creature;
        if (getGLOBAL()._render) {
            creature._spawned = true;
        }
        getGLOBAL().eventDispatcher.dispatchEvent(new CreepEvent(CreepEvent.DEFENDING_CREEP_SPAWNED, creature));
        return creature;
    }

    public static Clear(): void {
        for (const key in CREATURES._creatures) {
            const creature: MonsterBase = CREATURES._creatures[key];
            creature.clear();
            if (!BYMConfig.instance.RENDERER_ON) {
                getMAP()._BUILDINGTOPS.removeChild(creature.graphic);
            }
        }
        CREATURES._creatures = {};
        CREATURES._creatureCount = 0;
        for (let i = 0; i < CREATURES._guardianList.length; i++) {
            if (!BYMConfig.instance.RENDERER_ON) {
                getMAP()._BUILDINGTOPS.removeChild(CREATURES._guardianList[i].graphic);
            }
            CREATURES._guardianList[i] = null as any;
        }
        CREATURES._guardianList.length = 0;
    }

    public static get _hasLivingGuardian(): boolean {
        for (let i = 0; i < CREATURES._guardianList.length; i++) {
            if (CREATURES._guardianList[i] && CREATURES._guardianList[i].health > 0) {
                return true;
            }
        }
        return false;
    }

    public static get _guardian(): ChampionBase | null {
        for (let i = 0; i < CREATURES._guardianList.length; i++) {
            if (CREATURES._guardianList[i] && getCHAMPIONCAGE().isBasicGuardian(CREATURES._guardianList[i]._creatureID)) {
                return CREATURES._guardianList[i];
            }
        }
        return null;
    }

    public static get _krallen(): ChampionBase | null {
        for (let i = 0; i < CREATURES._guardianList.length; i++) {
            if (CREATURES._guardianList[i] && CREATURES._guardianList[i]._creatureID === "G5") {
                return CREATURES._guardianList[i];
            }
        }
        return null;
    }

    public static getGuardian(guardianType: number): ChampionBase | null {
        for (let i = 0; i < CREATURES._guardianList.length; i++) {
            if (parseInt(CREATURES._guardianList[i]._creatureID.substr(1)) === guardianType) {
                return CREATURES._guardianList[i];
            }
        }
        return null;
    }

    public static getGuardianIndex(guardianType: number): number {
        for (let i = 0; i < CREATURES._guardianList.length; i++) {
            if (parseInt(CREATURES._guardianList[i]._creatureID.substr(1)) === guardianType) {
                return i;
            }
        }
        return -1;
    }

    public static set _guardian(guardian: ChampionBase | null) {
        let foundIndex = -1;
        for (let i = 0; i < CREATURES._guardianList.length; i++) {
            if (CREATURES._guardianList[i] && getCHAMPIONCAGE().isBasicGuardian(CREATURES._guardianList[i]._creatureID)) {
                foundIndex = i;
            }
        }
        if (foundIndex === -1) {
            if (guardian) {
                CREATURES._guardianList.unshift(guardian);
            }
        } else if (!guardian) {
            CREATURES._guardianList.splice(foundIndex, 1);
        } else {
            CREATURES._guardianList[foundIndex] = guardian;
        }
    }

    public static addGuardian(guardian: ChampionBase): boolean {
        let foundIndex = -1;
        for (let i = 0; i < CREATURES._guardianList.length; i++) {
            if (CREATURES._guardianList[i]._creatureID === guardian._creatureID) {
                foundIndex = i;
            }
        }
        if (foundIndex === -1) {
            if (guardian) {
                CREATURES._guardianList.push(guardian);
                return true;
            }
        }
        return false;
    }

    public static removeGuardianType(guardianType: number): void {
        let i = 0;
        while (i < CREATURES._guardianList.length) {
            if (parseInt(CREATURES._guardianList[i]._creatureID.substr(1)) === guardianType) {
                break;
            }
            i++;
        }
        if (i < CREATURES._guardianList.length) {
            if (!BYMConfig.instance.RENDERER_ON) {
                getMAP()._BUILDINGTOPS.removeChild(CREATURES._guardianList[i].graphic);
            }
            if (CREATURES._guardianList[i] === CREATURES._guardian) {
                CREATURES._guardian = null;
            } else {
                CREATURES._guardianList.splice(i, 1);
            }
        }
    }

    public static removeAllGuardians(): void {
        const count = CREATURES._guardianList.length;
        for (let i = 0; i < count; i++) {
            if (!BYMConfig.instance.RENDERER_ON) {
                getMAP()._BUILDINGTOPS.removeChild(CREATURES._guardianList[i].graphic);
            }
        }
        CREATURES._guardianList.length = 0;
    }
}
