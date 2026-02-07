import { SecNum } from './com/cc/utils/SecNum';
import { TRIBES } from './com/monsters/ai/TRIBES';
import { MonsterData } from './com/monsters/player/MonsterData';
import MovieClip from 'openfl/display/MovieClip';
import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';
import { HousingPersistentPopup } from './HousingPersistentPopup';
import { MAPROOM_DESCENT } from './MAPROOM_DESCENT';

// Lazy imports to break circular dependency chains
function getInstanceManager(): any { return require("./com/monsters/managers/InstanceManager").InstanceManager; }
function getMapRoomManager(): any { return require("./com/monsters/maproom_manager/MapRoomManager").MapRoomManager; }
function getMonsterBase(): any { return require("./com/monsters/monsters/MonsterBase").MonsterBase; }
function getBASE(): any { return require("./BASE").BASE; }
function getBFOUNDATION(): any { return require("./BFOUNDATION").BFOUNDATION; }
function getBUILDING15(): any { return require("./BUILDING15").BUILDING15; }
function getCREATURELOCKER(): any { return require("./CREATURELOCKER").CREATURELOCKER; }
function getCREATURES(): any { return require("./CREATURES").CREATURES; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getGRID(): any { return require("./GRID").GRID; }
function getHOUSINGBUNKER(): any { return require("./HOUSINGBUNKER").HOUSINGBUNKER; }
function getHOUSINGPOPUP(): any { return require("./HOUSINGPOPUP").HOUSINGPOPUP; }
function getMAP(): any { return require("./MAP").MAP; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }


/**
 * HOUSING - Monster Housing System
 * Manages housing buildings and monster storage
 */
export class HOUSING {
    public static _housingPopup: MovieClip | null = null;
    public static _open: boolean = false;
    public static _housingCapacity: SecNum = new SecNum(0);
    public static _housingUsed: SecNum = new SecNum(0);
    public static _housingSpace: SecNum = new SecNum(0);
    public static _housingBuildingUpgrading: boolean = false;

    constructor() {}

    public static Show(event: MouseEvent | null = null): void {
        HOUSING._open = true;
        getGLOBAL().BlockerAdd();
        if (getMapRoomManager().instance.isInMapRoom3) {
            HOUSING._housingPopup = new HousingPersistentPopup() as any;
        } else {
            HOUSING._housingPopup = new (getHOUSINGPOPUP())() as any;
        }
        getGLOBAL()._layerWindows.addChild(HOUSING._housingPopup!);
        (HOUSING._housingPopup as any).Center();
        (HOUSING._housingPopup as any).ScaleUp();
    }

    public static Hide(event: MouseEvent | null = null): void {
        if (HOUSING._open) {
            getGLOBAL().BlockerRemove();
            getSOUNDS().Play("close");
            getGLOBAL()._layerWindows.removeChild(HOUSING._housingPopup!);
            HOUSING._open = false;
            HOUSING._housingPopup = null;
        }
    }

    public static HousingSpace(): void {
        HOUSING._housingCapacity = new SecNum(0);
        HOUSING._housingUsed = new SecNum(0);
        HOUSING._housingSpace = new SecNum(0);
        HOUSING._housingBuildingUpgrading = false;
        
        const housingClass = getBASE().isInfernoMainYardOrOutpost ? HOUSINGBUNKER : BUILDING15;
        const buildings = getInstanceManager().getInstancesByClass(housingClass);
        
        for (const building of buildings) {
            const b = building as BFOUNDATION;
            if (b._countdownBuild.Get() <= 0 && (b.health > 10 || getMapRoomManager().instance.isInMapRoom3)) {
                let capacity: number = b._buildingProps.capacity[b._lvl.Get() - 1];
                if (getGLOBAL()._extraHousing >= getGLOBAL().Timestamp() && getGLOBAL()._extraHousingPower.Get() > 0) {
                    capacity = HOUSING.addHousingCapacityMultiplier(capacity);
                }
                HOUSING._housingCapacity.Add(capacity);
            }
            if (b._countdownBuild.Get() + b._countdownUpgrade.Get() > 0) {
                HOUSING._housingBuildingUpgrading = true;
            }
        }

        const monsterCount: number = getGLOBAL().player.monsterList.length;
        for (let i = 0; i < monsterCount; i++) {
            const monster = getGLOBAL().player.monsterList[i];
            HOUSING._housingUsed.Add(getCREATURES().GetProperty(monster.m_creatureID, "cStorage", 0, true) * monster.numCreeps);
        }
        HOUSING._housingSpace.Set(HOUSING._housingCapacity.Get() - HOUSING._housingUsed.Get());
    }

    private static addHousingCapacityMultiplier(capacity: number): number {
        return capacity * getGLOBAL()._extraHousingPower.Get();
    }

    public static HousingStore(creatureId: string, position: Point, skipSpawn: boolean = false, instantTime: number = 0): boolean {
        if (instantTime > 0) {
            getGLOBAL().ErrorMessage("HOUSING insta monster hack");
            return false;
        }
        if (creatureId === "C100") creatureId = "C12";
        
        const storage: number = getCREATURES().GetProperty(creatureId, "cStorage", 0, true);
        const isJuiceMode: boolean = (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMATTACK || getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMVIEW) && 
                                     TRIBES.TribeForBaseID(getBASE()._wmID).behaviour === "juice";
        HOUSING.HousingSpace();
        
        if (HOUSING._housingSpace.Get() < storage && !isJuiceMode) return false;
        
        if (!skipSpawn) {
            if (isJuiceMode) {
                const monster = getCREATURES().Spawn(creatureId, getMAP()._BUILDINGTOPS!, "juice", position, 0);
                if (monster) monster.changeModeJuice();
            } else {
                const monster = HOUSING.createAndHouseCreep(creatureId, position);
                if (!monster) return false;
                getGLOBAL().player.addMonster(creatureId, monster);
            }
        }
        return true;
    }

    public static createAndHouseCreep(creatureId: string, position: Point): MonsterBase | null {
        const house: BFOUNDATION | null = HOUSING.getClosestHouseToPoint(position);
        if (!house) return null;
        return getCREATURES().Spawn(creatureId, getMAP()._BUILDINGTOPS!, "housing", position, 0, getGRID().FromISO(house._mc.x, house._mc.y), house);
    }

    public static getClosestHouseToPoint(position: Point): BFOUNDATION | null {
        const houses: any[] = [];
        const housingClass = getBASE().isInfernoMainYardOrOutpost ? HOUSINGBUNKER : BUILDING15;
        const buildings = getInstanceManager().getInstancesByClass(housingClass);
        
        for (const building of buildings) {
            const b = building as BFOUNDATION;
            if (b._countdownBuild.Get() <= 0 && (b.health > 0 || getMapRoomManager().instance.isInMapRoom3)) {
                const creatureCount: number = b._creatures.length;
                houses.push({ mc: b, dist: creatureCount });
            }
        }
        if (houses.length === 0) return null;
        houses.sort((a, b) => a.dist - b.dist);
        return houses[0].mc;
    }

    public static Cull(force: boolean = false): void {
        HOUSING._housingCapacity = new SecNum(0);
        HOUSING._housingUsed = new SecNum(0);
        HOUSING._housingSpace = new SecNum(0);
        
        const housingClass = getBASE().isInfernoMainYardOrOutpost ? HOUSINGBUNKER : BUILDING15;
        const buildings = getInstanceManager().getInstancesByClass(housingClass);
        
        for (const building of buildings) {
            const b = building as BFOUNDATION;
            if (b._countdownBuild.Get() <= 0 && (b.health > 0 || getMapRoomManager().instance.isInMapRoom3)) {
                let capacity: number = b._buildingProps.capacity[b._lvl.Get() - 1];
                if (getGLOBAL()._extraHousing >= getGLOBAL().Timestamp() && getGLOBAL()._extraHousingPower.Get() > 0) {
                    capacity = HOUSING.addHousingCapacityMultiplier(capacity);
                }
                HOUSING._housingCapacity.Add(capacity);
            }
        }

        const monsterCount: number = getGLOBAL().player.monsterList.length;
        for (let i = 0; i < monsterCount; i++) {
            const monster = getGLOBAL().player.monsterList[i];
            if (monster.numCreeps) {
                HOUSING._housingUsed.Add(getCREATURES().GetProperty(monster.m_creatureID, "cStorage", 0, true) * monster.numCreeps);
            }
        }

        while (HOUSING._housingUsed.Get() > HOUSING._housingCapacity.Get()) {
            HOUSING._housingUsed.Set(0);
            for (let i = 0; i < monsterCount; i++) {
                const monster = getGLOBAL().player.monsterList[i];
                if (monster.numCreeps > 0) {
                    monster.add(-1, null, true);
                    HOUSING._housingUsed.Add(getCREATURES().GetProperty(monster.m_creatureID, "cStorage", 0, true) * monster.numCreeps);
                }
            }
        }
        HOUSING.HousingSpace();
    }

    public static Populate(): void {
        const houses: BFOUNDATION[] = [];
        const housingClass = getBASE().isInfernoMainYardOrOutpost ? HOUSINGBUNKER : BUILDING15;
        const buildings = getInstanceManager().getInstancesByClass(housingClass);
        
        for (const building of buildings) {
            const b = building as BFOUNDATION;
            if (b.health > 0 || getMapRoomManager().instance.isInMapRoom3) {
                houses.push(b);
            }
        }

        if (houses.length > 0) {
            const monsterCount: number = getGLOBAL().player.monsterList.length;
            for (let i = 0; i < monsterCount; i++) {
                const monsterData = getGLOBAL().player.monsterList[i];
                const creepCount: number = monsterData.numCreeps;
                for (let j = 0; j < creepCount; j++) {
                    if (!monsterData.m_creeps[j].ownerID) {
                        const houseIdx: number = Math.floor(Math.random() * houses.length);
                        const house: BFOUNDATION = houses[houseIdx];
                        const housePos: Point = getGRID().FromISO(house.x, house.y);
                        monsterData.m_creeps[j].self = getCREATURES().Spawn(
                            monsterData.m_creatureID, getMAP()._BUILDINGTOPS!, getMonsterBase().k_sBHVR_PEN,
                            HOUSING.PointInHouse(housePos), Math.random() * 360, housePos, house,
                            monsterData.level, monsterData.m_creeps[j].health
                        );
                    }
                }
            }
        }
    }

    public static PointInHouse(housePos: Point): Point {
        const rect: Rectangle = new Rectangle(40, 40, 80, 80);
        return getGRID().ToISO(housePos.x + (rect.x + Math.random() * rect.width), housePos.y + (rect.y + Math.random() * rect.height), 0);
    }

    public static Update(): void {
        if (HOUSING._open && HOUSING._housingPopup) {
            (HOUSING._housingPopup as any).Update();
        }
    }

    public static catchupTick(deltaTime: number): void {
        getGLOBAL().player.tickHeal(deltaTime);
    }

    public static isHousingBuilding(buildingType: number): boolean {
        return buildingType === 15 || buildingType === 128;
    }

    public static AddHouse(building: BFOUNDATION): void {
        HOUSING.HousingSpace();
        getGLOBAL()._bHousing = building;
    }

    public static RemoveHouse(building: BFOUNDATION): void {
        getGLOBAL()._bHousing = null;
        HOUSING.HousingSpace();
    }

    public static GetHousingCreatures(): any[] {
        const aboveCreatures: any[] = [];
        const infernoCreatures: any[] = [];
        const allCreatures: any[] = [];
        
        const aboveUnlocked = getCREATURELOCKER().GetCreatures("above");
        if (!getBASE().isInfernoMainYardOrOutpost) {
            for (const id in aboveUnlocked) {
                const creature = getCREATURELOCKER()._creatures[id];
                if (!creature.blocked) {
                    creature.id = id;
                    aboveCreatures.push(creature);
                }
            }
            aboveCreatures.sort((a, b) => a.index - b.index);
        }

        const infernoUnlocked = getCREATURELOCKER().GetCreatures("inferno");
        if (MAPROOM_DESCENT.DescentPassed) {
            for (const id in infernoUnlocked) {
                const creature = getCREATURELOCKER()._creatures[id];
                if (!creature.blocked) {
                    creature.id = id;
                    infernoCreatures.push(creature);
                }
            }
            infernoCreatures.sort((a, b) => a.index - b.index);
        }

        if (aboveCreatures.length > 0) allCreatures.push(...aboveCreatures);
        if (infernoCreatures.length > 0) allCreatures.push(...infernoCreatures);

        const result: any[] = [];
        for (let i = 0; i < allCreatures.length; i++) {
            const monsterCount: number = getGLOBAL().player.monsterList.length;
            for (let j = 0; j < monsterCount; j++) {
                const monsterData: MonsterData = getGLOBAL().player.monsterList[j];
                if (monsterData.m_creatureID === allCreatures[i].id && monsterData.numCreeps > 0) {
                    const creatureInfo = allCreatures[i];
                    creatureInfo.quantity = monsterData.numHousedCreeps;
                    result.push(creatureInfo);
                }
            }
        }
        return result;
    }
}
