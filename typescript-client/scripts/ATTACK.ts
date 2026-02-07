import Point from 'openfl/geom/Point';
import TextFieldAutoSize from 'openfl/text/TextFieldAutoSize';
import { SecNum } from './com/cc/utils/SecNum';
import { ALLIANCES } from './com/monsters/alliances/ALLIANCES';
import { BYMConfig } from './com/monsters/configs/BYMConfig';
import { ScrollSet } from './com/monsters/display/ScrollSet';
import { ResourceBombs } from './com/monsters/effects/ResourceBombs';
import { ParticleDamageItem } from './com/monsters/effects/particles/ParticleDamageItem';
import { ParticleText } from './com/monsters/effects/particles/ParticleText';
import { EnumYardType } from './com/monsters/enums/EnumYardType';
import { AttackEvent } from './com/monsters/events/AttackEvent';
import { IAttackable } from './com/monsters/interfaces/IAttackable';
import { MapRoom3AttackFinishedPopup } from './com/monsters/maproom3/popups/MapRoom3AttackFinishedPopup';
import { popup_attackend } from './com/monsters/maproom_advanced/popup_attackend';
import { ChampionBase } from './com/monsters/monsters/champions/ChampionBase';
import { Krallen } from './com/monsters/monsters/champions/Krallen';
import { MonsterData } from './com/monsters/player/MonsterData';
import { Player } from './com/monsters/player/Player';
import { ParticleLoot } from './ParticleLoot';
import { ParticleVacuumLoot } from './ParticleVacuumLoot';

import { ACHIEVEMENTS } from './ACHIEVEMENTS';
import { DROPZONE } from './DROPZONE';
import { INFERNO_DESCENT_POPUPS } from './INFERNO_DESCENT_POPUPS';
import { INFERNO_EMERGENCE_EVENT } from './INFERNO_EMERGENCE_EVENT';
import { INFERNO_EMERGENCE_POPUPS } from './INFERNO_EMERGENCE_POPUPS';
import { MAPROOM } from './MAPROOM';
import { MAPROOM_DESCENT } from './MAPROOM_DESCENT';
import { POWERUPS } from './POWERUPS';
import { TRIBES } from './com/monsters/ai/TRIBES';
import { WMBASE } from './com/monsters/ai/WMBASE';
import { YARD_PROPS } from './YARD_PROPS';
import { frame } from './frame';
import { popup_attack_log } from './popup_attack_log';
import { popup_damaged_ai } from './popup_damaged_ai';
import { popup_defense } from './popup_defense';
import { popup_taunt_friend } from './popup_taunt_friend';

// Lazy imports to break circular dependency chains
function getInstanceManager(): any { return require("./com/monsters/managers/InstanceManager").InstanceManager; }
function getMapRoomManager(): any { return require("./com/monsters/maproom_manager/MapRoomManager").MapRoomManager; }
function getMonsterBase(): any { return require("./com/monsters/monsters/MonsterBase").MonsterBase; }
function getSiegeWeapons(): any { return require("./com/monsters/siege/SiegeWeapons").SiegeWeapons; }
function getBASE(): any { return require("./BASE").BASE; }
function getBFOUNDATION(): any { return require("./BFOUNDATION").BFOUNDATION; }
function getBMUSHROOM(): any { return require("./BMUSHROOM").BMUSHROOM; }
function getBUILDING14(): any { return require("./BUILDING14").BUILDING14; }
function getCHAMPIONCAGE(): any { return require("./CHAMPIONCAGE").CHAMPIONCAGE; }
function getCREATURELOCKER(): any { return require("./CREATURELOCKER").CREATURELOCKER; }
function getCREATURES(): any { return require("./CREATURES").CREATURES; }
function getCREEPS(): any { return require("./CREEPS").CREEPS; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getINFERNOPORTAL(): any { return require("./INFERNOPORTAL").INFERNOPORTAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getLOGGER(): any { return require("./LOGGER").LOGGER; }
function getLOGIN(): any { return require("./LOGIN").LOGIN; }
function getMAP(): any { return require("./MAP").MAP; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }
function getSPECIALEVENT(): any { return require("./SPECIALEVENT").SPECIALEVENT; }
function getSTORE(): any { return require("./STORE").STORE; }
function getTUTORIAL(): any { return require("./TUTORIAL").TUTORIAL; }
function getUI2(): any { return require("./UI2").UI2; }
function getWMATTACK(): any { return require("./WMATTACK").WMATTACK; }


/**
 * ATTACK - Handles attack mode combat, loot, and creature management
 * Converted from ActionScript to TypeScript
 */
export class ATTACK {
    public static readonly USE_CUMULATIVE_FLINGER_CAPACITY: boolean = true;
    
    public static _damageGrid: any;
    public static _loot: { [key: string]: SecNum };
    public static _hpLoot1: number = 0;
    public static _hpLoot2: number = 0;
    public static _hpLoot3: number = 0;
    public static _hpLoot4: number = 0;
    public static _log: any[] = [];
    public static _dropZone: DROPZONE | null = null;
    public static _flingerCooldown: number = 0;
    public static _flingerCooling: number = 0;
    public static _flingerBucket: { [key: string]: SecNum } = {};
    public static _bombSize: number = 0;
    public static _countdown: number = 0;
    public static _attackStart: number = 0;
    public static _sentOver: boolean = false;
    private static m_waitingForSaveToComplete: boolean = false;
    public static _flingValue: number = 0;
    public static _flingCount: number = 0;
    public static _logOpen: boolean = false;
    public static _shownLog: boolean = false;
    public static _acted: boolean = false;
    public static _healthOnStart: number = 0;
    public static _healthOnComplete: number = 0;
    public static _taunted: boolean = false;
    public static _tauntThreshold: number = 0.1;
    public static _attackLog: popup_attack_log | null = null;
    public static _shownAIPopup: boolean = false;
    public static _shownFinal: boolean = false;
    public static _flungSpace: SecNum = new SecNum(0);
    public static _deltaLoot: any = {};
    public static _hpDeltaLoot: any = {};
    public static _savedDeltaLoot: any = {};
    public static _creaturesFlung: SecNum = new SecNum(0);
    public static _creaturesLoaded: SecNum = new SecNum(0);
    private static m_recentlyAttacked: Map<any, number> = new Map();
    private static m_lastAttackTime: number = 0;
    public static _curCreaturesAvailable: { [key: string]: number } = {};
    
    constructor() {
        // Empty constructor
    }
    
    public static get waitingForSaveToComplete(): boolean {
        return ATTACK.m_waitingForSaveToComplete;
    }
    
    public static get hasCreaturesToAttackWith(): boolean {
        const creatures = getCREATURELOCKER()._creatures;
        const available = ATTACK._curCreaturesAvailable;
        const guardianData = getGLOBAL()._playerGuardianData;
        
        if (getGLOBAL()._loadmode === getGLOBAL().mode || (getGLOBAL()._loadmode !== getGLOBAL().mode && !MAPROOM_DESCENT.DescentPassed)) {
            for (const guardian of guardianData) {
                if (guardian && guardian.hp.Get() > 0 && guardian.status === ChampionBase.k_CHAMPION_STATUS_NORMAL) {
                    return true;
                }
            }
        }
        
        for (const creatureID in available) {
            if (available[creatureID] && available[creatureID] > 0 && creatures[creatureID]) {
                return true;
            }
        }
        
        return false;
    }
    
    public static Setup(): void {
        ATTACK.m_recentlyAttacked = new Map();
        ATTACK._flingerCooldown = 5;
        ATTACK._flingerCooling = 0;
        ATTACK._creaturesFlung.Set(0);
        ATTACK._creaturesLoaded.Set(0);
        ATTACK._flingerBucket = {};
        ATTACK._flingCount = 0;
        ATTACK._log = [];
        ATTACK._attackStart = getGLOBAL().Timestamp();
        ATTACK._flungSpace = new SecNum(0);
        ATTACK._loot = {
            r1: new SecNum(0),
            r2: new SecNum(0),
            r3: new SecNum(0),
            r4: new SecNum(0)
        };
        ATTACK._savedDeltaLoot = {
            r1: new SecNum(0),
            r2: new SecNum(0),
            r3: new SecNum(0),
            r4: new SecNum(0)
        };
        ATTACK._deltaLoot = { dirty: false };
        ATTACK._hpDeltaLoot = { dirty: false };
        ATTACK._hpLoot1 = 0;
        ATTACK._hpLoot2 = 0;
        ATTACK._hpLoot3 = 0;
        ATTACK._hpLoot4 = 0;
        ATTACK._dropZone = null;
        ATTACK._sentOver = false;
        ATTACK.m_waitingForSaveToComplete = false;
        ATTACK._logOpen = false;
        ATTACK._shownLog = false;
        ATTACK._shownAIPopup = false;
        ATTACK._acted = false;
        ATTACK._flingValue = 0;
        
        if (getGLOBAL()._attackersCatapult && 
            (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.ATTACK || 
             getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMATTACK || 
             getGLOBAL().mode === getGLOBAL().e_BASE_MODE.VIEW || 
             getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMVIEW)) {
            ResourceBombs.Setup();
        }
        
        if (!getMapRoomManager().instance.isInMapRoom2) {
            ATTACK._curCreaturesAvailable = {};
            const player: Player = getGLOBAL().attackingPlayer || getGLOBAL().player;
            const monsterCount = player.monsterList.length;
            
            for (let i = 0; i < monsterCount; i++) {
                ATTACK._curCreaturesAvailable[player.monsterList[i].m_creatureID] = player.monsterList[i].numHealthyHousedCreeps;
            }
        } else if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.ATTACK || getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMATTACK) {
            getGLOBAL()._attackerMapCreaturesStart = {};
            for (const creatureID in ATTACK._curCreaturesAvailable) {
                getGLOBAL()._attackerMapCreaturesStart[creatureID] = new SecNum(ATTACK._curCreaturesAvailable[creatureID]);
            }
        }
    }
    
    public static AttackData(): { champions: any[]; monsters: any[] } {
        const attackPayload: { champions: any[]; monsters: any[] } = { champions: [], monsters: [] };
        
        for (let i = 0; i < getGLOBAL()._playerGuardianData.length; i++) {
            const guardianData = getGLOBAL()._playerGuardianData[i];
            const guardianKey = "G" + guardianData.t;
            
            attackPayload.champions.push({
                type: guardianKey,
                stats: getCHAMPIONCAGE()._guardians[guardianKey].props
            });
        }
        
        for (const creatureID in ATTACK._curCreaturesAvailable) {
            attackPayload.monsters.push({
                id: creatureID,
                count: ATTACK._curCreaturesAvailable[creatureID],
                stats: getCREATURELOCKER()._creatures[creatureID].props
            });
        }
        
        return attackPayload;
    }
    
    public static Tick(): void {
        if (ATTACK._flingerCooling > 0) {
            --ATTACK._flingerCooling;
        }
        
        --ATTACK._countdown;
        
        if (ATTACK._countdown === -120) {
            ATTACK.RetreatAll();
        }
        
        let hasCreatures = false;
        let creatureCount = 0;
        
        for (let i = 0; i < getGLOBAL()._playerGuardianData.length; i++) {
            if (getGLOBAL()._playerGuardianData[i] && 
                getGLOBAL()._playerGuardianData[i].hp.Get() > 0 && 
                getGLOBAL()._playerGuardianData[i].status === ChampionBase.k_CHAMPION_STATUS_NORMAL) {
                creatureCount++;
            }
        }
        
        for (const creatureID in ATTACK._curCreaturesAvailable) {
            creatureCount += ATTACK._curCreaturesAvailable[creatureID];
        }
        
        let hasBombs = false;
        for (const bomb of Object.values(ResourceBombs._bombs)) {
            if (bomb.catapultLevel <= getGLOBAL()._attackersCatapult) {
                if (bomb.resource === 3) {
                    if (!bomb.used && creatureCount > 0) {
                        hasBombs = true;
                    }
                } else if (!bomb.used) {
                    hasBombs = true;
                }
            }
        }
        
        let activeBombCount = 0;
        for (const key in ResourceBombs._activeBombs) {
            activeBombCount++;
        }
        hasBombs = hasBombs || activeBombCount > 0;
        
        for (const key in ATTACK._flingerBucket) {
            creatureCount += ATTACK._flingerBucket[key].Get();
        }
        
        hasCreatures = creatureCount > 0;
        
        let hasBuildings = false;
        const buildings = getInstanceManager().getInstancesByClass(BFOUNDATION) as BFOUNDATION[];
        for (const building of buildings) {
            if (!(building instanceof getBMUSHROOM()) && 
                building._class !== "wall" && 
                building._class !== "trap" && 
                building._class !== "enemy" && 
                building._class !== "decoration" && 
                building._class !== "cage" && 
                building.health > 0) {
                hasBuildings = true;
                break;
            }
        }
        
        if (!ATTACK._sentOver && (!hasBuildings || !getCREEPS()._creepCount)) {
            if (ATTACK._countdown < 0 || !hasBuildings || (!hasCreatures && !hasBombs)) {
                ATTACK._sentOver = true;
                if (getBASE()._saveOver !== 1) {
                    getBASE().Save(1, false, true);
                }
                ATTACK.m_waitingForSaveToComplete = true;
            }
        }
    }
    
    public static ShowLog(delay: number = 0): void {
        let shouldShowTaunt: boolean = getBASE()._isProtected > 0;
        const townHallInstances = getInstanceManager().getInstancesByClass(BUILDING14) as BUILDING14[];
        
        for (const townHall of townHallInstances) {
            if (townHall.health === 0) {
                shouldShowTaunt = true;
            }
        }
        
        ATTACK._shownLog = false;
        
        if (!ATTACK._logOpen && getGLOBAL().mode === getGLOBAL().e_BASE_MODE.ATTACK) {
            ATTACK._logOpen = true;
            ATTACK._shownLog = true;
            
            let logLength = 0;
            for (const key in ATTACK._log) {
                logLength++;
            }
            
            if (logLength > 0) {
                const onActionDown = (event: MouseEvent): void => {
                    const target = event.target as any;
                    if (target.label === "Next" || target.labelKey === "btn_returnhome" || target.labelKey === "btn_skip") {
                        ATTACK._logOpen = false;
                        if (ATTACK._attackLog?.parent) {
                            ATTACK._attackLog.parent.removeChild(ATTACK._attackLog);
                        }
                        ATTACK.EndB();
                    }
                    if (target.labelKey === "btn_talktrash") {
                        ATTACK.ShowTaunt();
                    }
                };
                
                ATTACK._attackLog = new popup_attack_log();
                ATTACK._attackLog.Resize = () => {
                    if (ATTACK._attackLog) {
                        ATTACK._attackLog.x = 0;
                        ATTACK._attackLog.y = 0;
                    }
                };
                
                (ATTACK._attackLog.mcFrame as frame).Setup(false);
                ATTACK._attackLog.title_txt.htmlText = "<b>" + getKEYS().Get("attack_log_title") + "</b>";
                getGLOBAL()._layerMessages.addChild(ATTACK._attackLog);
                
                if (shouldShowTaunt && !ATTACK._taunted && MAPROOM._visitingFriend) {
                    ATTACK._attackLog.bAction.SetupKey("btn_talktrash");
                    ATTACK._attackLog.bAction.addEventListener("click", onActionDown);
                    ATTACK._attackLog.bAction.Highlight = true;
                    
                    if (getMapRoomManager().instance.isInMapRoom2) {
                        ATTACK._attackLog.b2.Setup(getKEYS().Get("btn_next"));
                    } else {
                        ATTACK._attackLog.b2.SetupKey("btn_returnhome");
                    }
                    ATTACK._attackLog.b2.addEventListener("click", onActionDown);
                } else {
                    ATTACK._attackLog.removeChild(ATTACK._attackLog.b2);
                    ATTACK._attackLog.bAction.Highlight = false;
                    
                    if (getMapRoomManager().instance.isInMapRoom2) {
                        ATTACK._attackLog.bAction.Setup(getKEYS().Get("btn_next"));
                    } else {
                        ATTACK._attackLog.bAction.SetupKey("btn_returnhome");
                    }
                    ATTACK._attackLog.bAction.addEventListener("click", onActionDown);
                }
                
                let str = ATTACK.LogRead();
                str += "<br><br>";
                ATTACK._attackLog.shell.body_txt.htmlText = str;
                ATTACK._attackLog.shell.body_txt.autoSize = TextFieldAutoSize.LEFT;
                
                const ss = new ScrollSet();
                ATTACK._attackLog.addChild(ss);
                ss.x = 613;
                ss.y = 115;
                ss.Init(ATTACK._attackLog.shell, ATTACK._attackLog.maskMC, 0, ATTACK._attackLog.maskMC.y, 270);
                ATTACK._attackLog.shell.mask = ATTACK._attackLog.maskMC;
            } else {
                ATTACK.EndB();
            }
        } else {
            ATTACK.EndB();
        }
    }
    
    public static ShowTaunt(event?: MouseEvent): void {
        let imgNumber = 1;
        
        try {
            if (ATTACK._attackLog?.parent) {
                ATTACK._attackLog.parent.removeChild(ATTACK._attackLog);
            }
        } catch (e) {
            // Ignore
        }
        
        const taunt = new popup_taunt_friend();
        taunt.tTitle.htmlText = getKEYS().Get("popup_title_tauntfriend");
        taunt.Resize = () => {
            taunt.x = 0;
            taunt.y = 0;
        };
        
        const onClose = (): void => {
            if (taunt.parent) {
                taunt.parent.removeChild(taunt);
            }
            ATTACK.End();
        };
        
        const onShare = (e: MouseEvent): void => {
            ATTACK._taunted = true;
            getGLOBAL().CallJS("sendFeed", [
                "taunt",
                getKEYS().Get("attack_taunt_streamtitle"),
                getKEYS().Get("attack_taunt_streambody"),
                "taunt" + imgNumber + ".png",
                getBASE()._loadedFBID
            ]);
            onClose();
        };
        
        const SwitchB = (n: number): void => {
            imgNumber = n;
            for (let i = 1; i < 4; i++) {
                taunt["mcIcon" + i].alpha = 0.4;
            }
            taunt["mcIcon" + n].alpha = 1;
        };
        
        const Switch = (n: number) => {
            return (e?: MouseEvent) => SwitchB(n);
        };
        
        taunt.bShare.SetupKey("btn_talktrash");
        getGLOBAL()._layerMessages.addChild(taunt);
        taunt.bShare.addEventListener("click", onShare);
        taunt.bShare.Highlight = true;
        (taunt.mcFrame as frame).Setup(true, onClose);
        
        for (let i = 1; i < 4; i++) {
            taunt["mcIcon" + i].buttonMode = true;
            taunt["mcIcon" + i].gotoAndStop(i);
            taunt["mcIcon" + i].addEventListener("click", Switch(i));
        }
        
        SwitchB(1);
    }
    
    public static DropZone(size: number, type: number = 1): void {
        if (!ATTACK._dropZone) {
            ATTACK._dropZone = getMAP()._BUILDINGBASES.addChild(new DROPZONE(size, type)) as DROPZONE;
        } else {
            ATTACK._dropZone.Update(size, type);
        }
    }
    
    public static Log(id: string, event: string): void {
        ATTACK._acted = true;
        
        for (let i = 0; i < ATTACK._log.length; i++) {
            if (ATTACK._log[i].id === id) {
                ATTACK._log[i].event = event;
                ATTACK._log[i].time = getGLOBAL().Timestamp() - ATTACK._attackStart;
                return;
            }
        }
        
        ATTACK._log.push({
            id: id,
            time: getGLOBAL().Timestamp() - ATTACK._attackStart,
            event: event
        });
    }
    
    public static LogRead(): string {
        let result = "";
        
        if (ATTACK._log.length > 0) {
            result = "<ul>";
            ATTACK._log.sort((a, b) => a.time - b.time);
            
            for (let i = 0; i < ATTACK._log.length; i++) {
                result += `<li><font color="#999999">${getGLOBAL().ToTime(ATTACK._log[i].time, true)}</font>: ${ATTACK._log[i].event}</li>`;
            }
            result += "</ul>";
            
            const totalLoot = ATTACK._loot.r1.Get() + ATTACK._loot.r2.Get() + ATTACK._loot.r3.Get() + ATTACK._loot.r4.Get();
            if (totalLoot > 0) {
                result += "<br>" + getKEYS().Get("attack_log_resourceslooted") + ":<br>";
                const lootItems: [number, string][] = [];
                
                if (ATTACK._loot.r1.Get() > 0) {
                    lootItems.push([ATTACK._loot.r1.Get(), getKEYS().Get(getGLOBAL()._resourceNames[0])]);
                }
                if (ATTACK._loot.r2.Get() > 0) {
                    lootItems.push([ATTACK._loot.r2.Get(), getKEYS().Get(getGLOBAL()._resourceNames[1])]);
                }
                if (ATTACK._loot.r3.Get() > 0) {
                    lootItems.push([ATTACK._loot.r3.Get(), getKEYS().Get(getGLOBAL()._resourceNames[2])]);
                }
                if (ATTACK._loot.r4.Get() > 0) {
                    lootItems.push([ATTACK._loot.r4.Get(), getKEYS().Get(getGLOBAL()._resourceNames[3])]);
                }
                result += getGLOBAL().Array2String(lootItems);
            }
        }
        
        return result;
    }
    
    public static RemoveDropZone(): void {
        if (ATTACK._dropZone) {
            ATTACK._dropZone.Destroy();
            getMAP()._BUILDINGBASES.removeChild(ATTACK._dropZone);
        }
        ATTACK._dropZone = null;
    }
    
    public static Spawn(point: { x: number; y: number }, radius: number): void {
        const flungItems: [number, string][] = [];
        
        for (const creatureID in ATTACK._flingerBucket) {
            if (ATTACK._flingerBucket[creatureID].Get() > 0) {
                if (creatureID.substr(0, 1) === "G") {
                    const guardianIndex = getGLOBAL().getPlayerGuardianIndex(parseInt(creatureID.substr(1)));
                    const guardianLevel = getGLOBAL()._playerGuardianData[guardianIndex].l.Get();
                    const angle = Math.random() * 360 * 0.0174532925;
                    const dist = Math.random() * radius / 2;
                    const spawnPoint = { x: point.x + Math.sin(angle) * dist, y: point.y + Math.cos(angle) * dist };
                    
                    getCREEPS().SpawnGuardian(
                        getGLOBAL()._playerGuardianData[guardianIndex].t,
                        getMAP()._BUILDINGTOPS,
                        "bounce",
                        guardianLevel,
                        new Point(spawnPoint.x, spawnPoint.y),
                        Math.random() * 360,
                        getGLOBAL()._playerGuardianData[guardianIndex].hp.Get(),
                        getGLOBAL()._playerGuardianData[guardianIndex].fb.Get(),
                        getGLOBAL()._playerGuardianData[guardianIndex].pl.Get()
                    );
                    
                    if (!getMapRoomManager().instance.isInMapRoom3) {
                        ATTACK._flungSpace.Add(getCHAMPIONCAGE().GetGuardianProperty(creatureID.substr(0, 2), guardianLevel, "bucket"));
                    }
                    
                    const guardianName = "Level " + guardianLevel + " " + getCHAMPIONCAGE()._guardians["G" + getGLOBAL()._playerGuardianData[guardianIndex].t].name;
                    flungItems.push([1, guardianName]);
                    getCREEPS()._flungGuardian[guardianIndex] = true;
                } else {
                    ATTACK._flungSpace.Add(getCREATURES().GetProperty(creatureID, "bucket") * ATTACK._flingerBucket[creatureID].Get());
                    const monsterName = getKEYS().Get(getCREATURELOCKER()._creatures[creatureID].name);
                    flungItems.push([ATTACK._flingerBucket[creatureID].Get(), monsterName]);
                    
                    for (let j = 0; j < ATTACK._flingerBucket[creatureID].Get(); j++) {
                        const angle = Math.random() * 360 * 0.0174532925;
                        const dist = Math.random() * radius / 2;
                        const spawnPoint = { x: point.x + Math.sin(angle) * dist, y: point.y + Math.cos(angle) * dist };
                        
                        const monster = getCREEPS().Spawn(creatureID, getMAP()._BUILDINGTOPS, "bounce", new Point(spawnPoint.x, spawnPoint.y), Math.random() * 360);
                        monster._hitLimit = Number.MAX_SAFE_INTEGER;
                        
                        if (!getMapRoomManager().instance.isInMapRoom2or3) {
                            getGLOBAL().attackingPlayer.monsterListByID(creatureID).add(-1);
                        } else if (getMapRoomManager().instance.isInMapRoom3) {
                            getGLOBAL().attackingPlayer.monsterListByID(creatureID).linkCreepToData(monster);
                        }
                    }
                    
                    if (ALLIANCES._myAlliance) {
                        getLOGGER().Stat([28, creatureID, ATTACK._flingerBucket[creatureID].Get(), ALLIANCES._allianceID]);
                    } else {
                        getLOGGER().Stat([28, creatureID, ATTACK._flingerBucket[creatureID].Get()]);
                    }
                    
                    ATTACK._flingValue += getCREATURES().GetProperty(creatureID, "cResource");
                }
            }
        }
        
        ATTACK._creaturesFlung.Add(ATTACK._creaturesLoaded.Get());
        ATTACK._creaturesLoaded.Set(0);
        
        if (flungItems.length === 1 && flungItems[0][0] === 1) {
            ATTACK.Log("fling" + ATTACK._flingCount, `<font color="#0000FF">${getKEYS().Get("attack_log_flungin", { v1: getGLOBAL().Array2String(flungItems) })}</font>`);
        } else {
            ATTACK.Log("fling" + ATTACK._flingCount, `<font color="#0000FF">${getKEYS().Get("attack_log_flungin_pl", { v1: getGLOBAL().Array2String(flungItems) })}</font>`);
        }
        
        ++ATTACK._flingCount;
        ATTACK._flingerBucket = {};
        ATTACK._flingerCooling = ATTACK._flingerCooldown;
        getUI2().Update();
        
        if (getBASE()._saveOver !== 1) {
            getBASE().Save();
        }
        
        ATTACK.RemoveDropZone();
    }
    
    public static BucketAdd(creatureID: string): boolean {
        let capacity = getGLOBAL()._buildingProps[4].capacity[getGLOBAL()._attackersFlinger - 1];
        
        if (MAPROOM_DESCENT.InDescent) {
            capacity = YARD_PROPS._yardProps[4].capacity[getGLOBAL()._attackersFlinger - 1];
        }
        
        if (POWERUPS.CheckPowers(POWERUPS.ALLIANCE_DECLAREWAR, "OFFENSE")) {
            capacity += Math.floor(capacity * 0.25);
        }
        
        if (getMapRoomManager().instance.isInMapRoom3 && ATTACK.USE_CUMULATIVE_FLINGER_CAPACITY) {
            capacity -= ATTACK._flungSpace.Get();
        }
        
        if (creatureID.substr(0, 1) === "G") {
            const guardianIndex = getGLOBAL().getPlayerGuardianIndex(parseInt(creatureID.substr(1)));
            if (!getMapRoomManager().instance.isInMapRoom3) {
                capacity -= getCHAMPIONCAGE().GetGuardianProperty(creatureID.substr(0, 2), getGLOBAL()._playerGuardianData[guardianIndex].l.Get(), "bucket");
            }
            ATTACK._flingerBucket[creatureID] = new SecNum(1);
            ATTACK._creaturesLoaded.Add(1);
            getSOUNDS().Play("click1");
        } else if (ATTACK._curCreaturesAvailable[creatureID] > 0) {
            for (const key in ATTACK._flingerBucket) {
                capacity -= getCREATURES().GetProperty(key, "bucket") * ATTACK._flingerBucket[key].Get();
            }
            
            if (capacity >= getCREATURES().GetProperty(creatureID, "bucket")) {
                ATTACK._curCreaturesAvailable[creatureID] = ATTACK._curCreaturesAvailable[creatureID] - 1;
                ATTACK._creaturesLoaded.Add(1);
                
                if (!ATTACK._flingerBucket[creatureID]) {
                    ATTACK._flingerBucket[creatureID] = new SecNum(0);
                }
                ATTACK._flingerBucket[creatureID].Add(1);
                getSOUNDS().Play("click1");
            }
        }
        
        return false;
    }
    
    public static BucketRemove(creatureID: string): boolean {
        if (ATTACK._flingerBucket[creatureID] && ATTACK._flingerBucket[creatureID].Get() > 0) {
            ATTACK._flingerBucket[creatureID].Add(-1);
            
            if (creatureID.substr(0, 1) === "G") {
                delete ATTACK._flingerBucket[creatureID];
            } else {
                ATTACK._curCreaturesAvailable[creatureID] += 1;
            }
            
            ATTACK._creaturesLoaded.Add(-1);
            getSOUNDS().Play("click1");
            return true;
        }
        
        return false;
    }
    
    public static BucketUpdate(): void {
        let bucketSize = 0;
        
        for (const creatureID in ATTACK._flingerBucket) {
            if (creatureID.substr(0, 1) === "G") {
                let guardianIndex = 0;
                while (guardianIndex < getGLOBAL()._playerGuardianData.length) {
                    if (creatureID.substr(1) === getGLOBAL()._playerGuardianData[guardianIndex].t) {
                        break;
                    }
                    guardianIndex++;
                }
                bucketSize += getCHAMPIONCAGE().GetGuardianProperty(creatureID.substr(0, 2), getGLOBAL()._playerGuardianData[guardianIndex].l.Get(), "bucket");
            } else {
                bucketSize += getCREATURES().GetProperty(creatureID, "bucket") * ATTACK._flingerBucket[creatureID].Get();
            }
        }
        
        ResourceBombs.BombRemove();
        
        if (getUI2()._top && getUI2()._top._siegeweapon) {
            getUI2()._top._siegeweapon.Cancel();
        }
        
        if (bucketSize === 0) {
            ATTACK.RemoveDropZone();
        } else {
            bucketSize /= 4;
            if (bucketSize < 200) {
                bucketSize = 200;
            }
            ATTACK.DropZone(bucketSize, 1);
        }
        
        getUI2().Update();
    }
    
    public static Loot(
        resourceType: number,
        amount: number,
        x: number,
        y: number,
        displaySize: number = 10,
        building: BFOUNDATION | null = null,
        vacuum: boolean = false
    ): number {
        if (getLOGIN()._playerLevel < 20) {
            amount += amount * Math.max(0, (20 - getLOGIN()._playerLevel) * 0.03);
        }
        
        ATTACK._loot["r" + resourceType].Add(amount);
        
        switch (resourceType) {
            case 1:
                ATTACK._hpLoot1 += amount;
                break;
            case 2:
                ATTACK._hpLoot2 += amount;
                break;
            case 3:
                ATTACK._hpLoot3 += amount;
                break;
            case 4:
                ATTACK._hpLoot4 += amount;
        }
        
        let actualGain = amount;
        const maxResource = getGLOBAL()._resources["r" + resourceType + "max"];
        const currentResource = getGLOBAL()._resources["r" + resourceType].Get();
        const krallen = getCREEPS().krallen;
        
        let adjustedMax = maxResource;
        if (krallen) {
            adjustedMax += maxResource * krallen._buff;
        }
        
        if (currentResource + amount > adjustedMax) {
            if ((getBASE().isInfernoMainYardOrOutpost && MAPROOM_DESCENT.DescentPassed) || getGLOBAL().mode === getGLOBAL()._loadmode) {
                actualGain = adjustedMax - currentResource;
                if (actualGain < 0) {
                    actualGain = 0;
                }
            }
        }
        
        getGLOBAL()._resources["r" + resourceType].Add(actualGain);
        getGLOBAL()._hpResources["r" + resourceType] += actualGain;
        
        if (ATTACK._deltaLoot["r" + resourceType]) {
            ATTACK._deltaLoot["r" + resourceType].Add(actualGain);
            ATTACK._hpDeltaLoot["r" + resourceType] += actualGain;
        } else {
            ATTACK._deltaLoot["r" + resourceType] = new SecNum(actualGain);
            ATTACK._hpDeltaLoot["r" + resourceType] = actualGain;
        }
        
        ATTACK._deltaLoot.dirty = true;
        ATTACK._hpDeltaLoot.dirty = true;
        
        if (getGLOBAL()._render && building) {
            let particleType = resourceType;
            if (getBASE().isInfernoMainYardOrOutpost) {
                particleType += 4;
            }
            
            if (vacuum) {
                new ParticleVacuumLoot(building, amount, particleType);
            } else {
                new ParticleLoot(building, amount, particleType);
            }
            ParticleText.Create(new Point(x, y - 35), amount, particleType);
        }
        
        return amount;
    }
    
    public static SaveDeltaLoot(): void {
        if (ATTACK._deltaLoot.dirty) {
            for (let i = 1; i < 5; i++) {
                if (ATTACK._deltaLoot["r" + i]) {
                    if (ATTACK._savedDeltaLoot["r" + i]) {
                        ATTACK._savedDeltaLoot["r" + i].Add(ATTACK._deltaLoot["r" + i].Get());
                    } else {
                        ATTACK._savedDeltaLoot["r" + i] = new SecNum(ATTACK._deltaLoot["r" + i].Get());
                    }
                    
                    if (ATTACK._deltaLoot["r" + i].Get() !== ATTACK._hpDeltaLoot["r" + i]) {
                        getLOGGER().Log("log", "ATTACK.SaveDeltaLoot delta loot mismatch secure " + ATTACK._deltaLoot["r" + i].Get() + " unsecure " + ATTACK._hpDeltaLoot["r" + i]);
                        getGLOBAL().ErrorMessage("ATTACK.SaveDeltaLoot");
                    }
                }
            }
        }
        
        ATTACK._deltaLoot = { dirty: false };
        ATTACK._hpDeltaLoot = { dirty: false };
    }
    
    public static CleanLoot(): void {
        ATTACK._savedDeltaLoot = {
            r1: new SecNum(0),
            r2: new SecNum(0),
            r3: new SecNum(0),
            r4: new SecNum(0)
        };
    }
    
    public static Miss(x: number, y: number): void {
        // Empty implementation
    }
    
    public static damage(amount: number, target: IAttackable | null = null, modifier: number = 0): void {
        const currentTime = Date.now();
        
        if (currentTime - ATTACK.m_lastAttackTime > 400) {
            ATTACK.m_recentlyAttacked = new Map();
            ATTACK.m_lastAttackTime = currentTime;
        }
        
        let particleType = ParticleText.TYPE_DAMAGE;
        if (amount < 0) {
            particleType = ParticleText.TYPE_HEAL;
        }
        
        const point = new Point(target?.x || 0, target?.y || 0);
        if (target && target instanceof getMonsterBase()) {
            point.y -= (target as MonsterBase)._altitude;
        }
        
        const recentCount = ATTACK.m_recentlyAttacked.get(target) || 0;
        ATTACK.m_recentlyAttacked.set(target, recentCount + 1);
        
        if (recentCount > 2) {
            return;
        }
        
        if (recentCount === 1) {
            point.x += 10 * amount.toString().length;
        } else if (recentCount === 2) {
            point.x -= 10 * amount.toString().length;
        }
        
        const damageItem = ParticleText.Create(point, amount, particleType);
        
        if (modifier !== 0 && damageItem) {
            const sign = modifier < 0 ? "-" : "+";
            damageItem._mc.tLootA.htmlText += "(" + sign + Math.abs(Math.round(modifier)) + ")";
            damageItem._mc.tLootB.htmlText += "(" + sign + Math.abs(Math.round(modifier)) + ")";
        }
    }
    
    public static Damage(x: number, y: number, amount: number, param4: boolean = true, param5: boolean = false): void {
        // Empty implementation
    }
    
    public static ProcessDamageGrid(): void {
        // Empty implementation
    }
    
    public static RetreatAll(): void {
        for (const key in getCREEPS()._creeps) {
            getCREEPS()._creeps[key].changeModeRetreat();
        }
        
        if (getBASE()._saveOver !== 1) {
            getBASE().Save(1, false, true);
        }
        
        getGLOBAL().Message(getKEYS().Get("attack_msg_attackover"));
    }
    
    private static BucketClear(): void {
        for (const creatureID in ATTACK._flingerBucket) {
            const count = ATTACK._flingerBucket[creatureID].Get();
            for (let i = 0; i <= count; i++) {
                ATTACK.BucketRemove(creatureID);
            }
        }
        ATTACK.BucketUpdate();
    }
    
    private static updateCreepAttackToPlayerSavingFunction(): void {
        const creepCount = getCREEPS().m_attackingCreeps.length;
        
        for (let i = 0; i < creepCount; i++) {
            if (!getCREEPS().m_attackingCreeps[i].isDisposable) {
                const monsterData = getGLOBAL().attackingPlayer.monsterListByID(getCREEPS().m_attackingCreeps[i]._creatureID);
                
                if (monsterData) {
                    let j = 0;
                    while (j < monsterData.m_creeps.length && 
                           monsterData.m_creeps[j].health < (getCREEPS().m_attackingCreeps[i] as MonsterBase).maxHealth) {
                        j++;
                    }
                    
                    const currentHealth = (getCREEPS().m_attackingCreeps[i] as MonsterBase).health;
                    monsterData.m_creeps[j].health = currentHealth > 0 ? currentHealth : 1;
                }
            }
        }
        
        getBASE().SaveB();
    }
    
    public static End(): void {
        ATTACK.m_waitingForSaveToComplete = false;
        ATTACK.BucketClear();
        
        if (!ATTACK._sentOver) {
            if (getBASE()._saveOver !== 1) {
                getBASE().Save(1, false, true);
            }
            ATTACK._sentOver = true;
        }
        
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.ATTACK || getGLOBAL().mode === getGLOBAL().e_BASE_MODE.IATTACK) {
            if (getCREEPS()._guardian && getCREEPS()._guardian.health > 0) {
                getLOGGER().Stat([53, getCREEPS()._guardian._creatureID, 1]);
            }
            if (getCREATURES()._guardian && getCREATURES()._guardian.health > 0) {
                getLOGGER().Stat([55, getCREATURES()._guardian._creatureID, 1]);
            }
        }
        
        for (const key in getCREEPS()._creeps) {
            getCREEPS()._creeps[key].changeModeRetreat();
        }
        
        getSiegeWeapons().deactivateWeapon();
        
        if (getMapRoomManager().instance.isInMapRoom2or3 && getBASE().isMainYardOrInfernoMainYard && 
            (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.ATTACK || getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMATTACK)) {
            ATTACK._logOpen = false;
            ATTACK.ShowLog();
            ATTACK._shownFinal = false;
        } else if (MAPROOM_DESCENT.DescentLevel && MAPROOM_DESCENT.InDescent) {
            ATTACK.ShowComplete();
        } else {
            ATTACK.EndB();
        }
        
        const totalLoot = ATTACK._loot.r1.Get() + ATTACK._loot.r2.Get() + ATTACK._loot.r3.Get() + ATTACK._loot.r4.Get();
        getLOGGER().KongStat([3, totalLoot]);
    }
    
    public static ShowComplete(): void {
        ATTACK.EndB();
    }
    
    private static EndBForMapRoom3(): void {
        const damagePercent = ATTACK.CalculateBaseDamagePercent();
        const isVictory = damagePercent >= BYMConfig.k_sVICTORY_THRESHOLD;
        
        if (getBASE().isMainYard) {
            getGLOBAL().ShowMap();
        } else if (getBASE().isOutpost) {
            if (!isVictory) {
                MapRoom3AttackFinishedPopup.instance.Show(isVictory);
            }
        } else if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMATTACK) {
            WMBASE._destroyed = isVictory;
            MapRoom3AttackFinishedPopup.instance.Show(isVictory);
        }
    }
    
    public static EndB(): void {
        ATTACK._shownFinal = true;
        const isInDescent = INFERNO_DESCENT_POPUPS.isInDescent();
        
        let currentHealth = 0;
        let maxHealth = 0;
        
        const buildings = getInstanceManager().getInstancesByClass(BFOUNDATION) as BFOUNDATION[];
        for (const building of buildings) {
            if (building._class !== "wall" && 
                !((building._class as any) === "trap" && (building._class as any) === "enemy" && building._fired) &&
                !(building._type === 53 && building._expireTime < getGLOBAL().Timestamp())) {
                currentHealth += building.health;
                maxHealth += building.maxHealth;
            }
        }
        
        const damagePercent = 100 - (100 / maxHealth * currentHealth);
        
        if (getMapRoomManager().instance.isInMapRoom3 && !isInDescent && !getBASE().isInfernoMainYardOrOutpost) {
            ATTACK.EndBForMapRoom3();
            return;
        }
        
        let isVictory = false;
        
        if (getMapRoomManager().instance.isInMapRoom2 && !isInDescent) {
            if ((getBASE().isOutpostMapRoom2Only || getGLOBAL()._loadmode === getGLOBAL().e_BASE_MODE.WMATTACK) && 
                damagePercent >= BYMConfig.k_sVICTORY_THRESHOLD) {
                isVictory = true;
                if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMATTACK) {
                    WMBASE._destroyed = true;
                }
            } else if ((getBASE().isMainYardInfernoOnly || getGLOBAL()._loadmode === getGLOBAL().e_BASE_MODE.IWMATTACK) && 
                       damagePercent >= BYMConfig.k_sVICTORY_THRESHOLD) {
                isVictory = true;
                if (getGLOBAL()._loadmode === getGLOBAL().e_BASE_MODE.IWMATTACK) {
                    WMBASE._destroyed = true;
                }
            }
        } else if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMATTACK || getGLOBAL().mode === getGLOBAL().e_BASE_MODE.IWMATTACK) {
            const townHalls = getInstanceManager().getInstancesByClass(BUILDING14) as BUILDING14[];
            
            for (const townHall of townHalls) {
                if (townHall.health === 0 && townHall._repairing === 0 &&
                    (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMATTACK || getGLOBAL().mode === getGLOBAL().e_BASE_MODE.IWMATTACK)) {
                    if (TRIBES.TribeForBaseID(getBASE()._wmID).id === 2) {
                        ACHIEVEMENTS.Check("wm2hall", 1);
                    }
                    if (!MAPROOM_DESCENT.InDescent) {
                        isVictory = true;
                    }
                    break;
                }
            }
            
            if (damagePercent >= BYMConfig.k_sVICTORY_THRESHOLD && MAPROOM_DESCENT.InDescent) {
                isVictory = true;
            }
            
            if (INFERNO_DESCENT_POPUPS.isInDescent()) {
                INFERNO_DESCENT_POPUPS.ShowPostAttackPopup(
                    MAPROOM_DESCENT._descentLvl,
                    isVictory,
                    [ATTACK._loot.r1.Get(), ATTACK._loot.r2.Get(), ATTACK._loot.r3.Get(), ATTACK._loot.r4.Get()],
                    [MAPROOM_DESCENT._loot.r1.Get(), MAPROOM_DESCENT._loot.r2.Get(), MAPROOM_DESCENT._loot.r3.Get(), MAPROOM_DESCENT._loot.r4.Get()]
                );
                ACHIEVEMENTS.Check(ACHIEVEMENTS.DESCENT_LEVEL, MAPROOM_DESCENT.DescentLevel);
            }
        }
        
        if (getBASE().isInfernoMainYardOrOutpost) {
            getSOUNDS().PlayMusic("musicibuild");
        } else {
            getSOUNDS().PlayMusic("musicbuild");
        }
        
        getGLOBAL().eventDispatcher.dispatchEvent(new AttackEvent(AttackEvent.ATTACK_OVER, isVictory, getBASE()._wmID, ATTACK._loot));
        
        if ((getMapRoomManager().instance.isInMapRoom2 && getBASE().isOutpostMapRoom2Only) || 
            getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMATTACK || 
            getGLOBAL().mode === getGLOBAL().e_BASE_MODE.IWMATTACK) {
            const popup = new popup_attackend(isVictory);
            popup.mcFrame.Setup(false);
            getPOPUPS().Push(popup);
            
            if (getMapRoomManager().instance.isInMapRoom2 && !getGLOBAL().m_mapRoomFunctional) {
                getGLOBAL().Message(getKEYS().Get("map_msg_damaged"));
            }
        } else if (getMapRoomManager().instance.isInMapRoom2) {
            getGLOBAL().ShowMap();
        } else if (getGLOBAL()._loadmode === getGLOBAL().mode) {
            getBASE().LoadBase(null, 0, 0, getGLOBAL().e_BASE_MODE.BUILD, false, EnumYardType.MAIN_YARD);
        } else if (MAPROOM_DESCENT.InDescent) {
            getBASE().LoadBase(null, 0, 0, getGLOBAL().e_BASE_MODE.BUILD, false, EnumYardType.MAIN_YARD);
        } else {
            getBASE().LoadBase(getGLOBAL()._infBaseURL, 0, 0, "ibuild", false, EnumYardType.INFERNO_YARD);
        }
    }
    
    public static WellDefended(wildMonsters: boolean = true, attackersName: string = ""): void {
        const tribe = TRIBES.TribeForBaseID(getWMATTACK()._attackersBaseID);
        
        const activeEvent = getSPECIALEVENT().getActiveSpecialEvent();
        if (activeEvent.active) {
            activeEvent.EndRound(true);
            return;
        }
        
        if (INFERNO_EMERGENCE_EVENT.isAttackActive) {
            INFERNO_EMERGENCE_POPUPS.ShowStagePassed(getINFERNOPORTAL().building._lvl.Get());
            return;
        }
        
        const Post = (): void => {
            if (wildMonsters) {
                getGLOBAL().CallJS("sendFeed", [
                    "defense-wild",
                    getKEYS().Get("ai_gooddefense_streamtitle", { v1: tribe.name }),
                    getKEYS().Get("ai_gooddefense", { v1: tribe.name }),
                    tribe.streampostpic
                ]);
            } else {
                getGLOBAL().CallJS("sendFeed", [
                    "defense-human",
                    getKEYS().Get("attack_gooddefense_streamtitle", { v1: attackersName }),
                    getKEYS().Get("attack_gooddefense_streambody"),
                    "defense2.png"
                ]);
            }
            getPOPUPS().Next();
        };
        
        const popupMC = new popup_defense();
        
        if (wildMonsters) {
            popupMC.tText.htmlText = "<b>" + getKEYS().Get("ai_gooddefense", { v1: tribe.name }) + "</b>";
        } else {
            popupMC.tText.htmlText = "<b>" + getKEYS().Get("attack_gooddefense", { v1: attackersName }) + "</b>";
        }
        
        popupMC.bAction.SetupKey("btn_brag");
        popupMC.bAction.addEventListener("click", Post);
        popupMC.bAction.Highlight = true;
        
        if (wildMonsters) {
            getPOPUPS().Push(popupMC, null, null, null, tribe.splash.split("popups/").join(""));
        } else {
            getPOPUPS().Push(popupMC, null, null, null, "defense2.png");
        }
    }
    
    public static PoorDefense(): void {
        if (INFERNO_EMERGENCE_EVENT.isAttackActive) {
            INFERNO_EMERGENCE_POPUPS.ShowStagePassed(getINFERNOPORTAL().building._lvl.Get());
            return;
        }
        
        if (getTUTORIAL()._stage > 40) {
            const mc = new popup_damaged_ai();
            
            const RepairAll = (event?: MouseEvent): void => {
                mc.bAction.removeEventListener("click", RepairAll);
                mc.bAction2.removeEventListener("click", RepairNow);
                
                const buildings = getInstanceManager().getInstancesByClass(BFOUNDATION) as BFOUNDATION[];
                for (const building of buildings) {
                    if (building.health < building.maxHealth && building._repairing === 0) {
                        building.Repair();
                    }
                }
                
                getSOUNDS().Play("repair1", 0.25);
                getPOPUPS().Next();
            };
            
            const RepairNow = (event?: MouseEvent): void => {
                mc.bAction.removeEventListener("click", RepairAll);
                mc.bAction2.removeEventListener("click", RepairNow);
                
                const buildings = getInstanceManager().getInstancesByClass(BFOUNDATION) as BFOUNDATION[];
                for (const building of buildings) {
                    if (building.health < building.maxHealth && building._repairing === 0) {
                        building.Repair();
                    }
                }
                
                getSTORE().ShowB(3, 1, ["FIX"], true);
                getPOPUPS().Next();
            };
            
            (mc.mcFrame as frame).Setup(false);
            mc.tA.htmlText = "<b>" + getKEYS().Get("ai_poordefense_ta") + "</b>";
            mc.tB.htmlText = "<b>" + getKEYS().Get("ai_poordefense_tb") + "</b>";
            mc.tC.htmlText = getKEYS().Get("ai_poordefense_tc");
            mc.bAction.SetupKey("ai_repairdamage_btn");
            mc.bAction.addEventListener("click", RepairAll);
            mc.bAction2.SetupKey("pop_damaged_repairnow_btn");
            mc.bAction2.addEventListener("click", RepairNow);
            mc.bAction2.Highlight = true;
            
            getPOPUPS().Push(mc, null, null, "shotgun", "military.png");
        }
    }
    
    protected static CalculateBaseDamagePercent(maxPercent: number = 100): number {
        let maxHealth = 0;
        let currentHealth = 0;
        
        const buildings = getInstanceManager().getInstancesByClass(BFOUNDATION) as BFOUNDATION[];
        
        for (const building of buildings) {
            if (building._class !== "wall" && 
                !((building._class as any) === "trap" && (building._class as any) === "enemy" && building._fired) &&
                !(building._type === 53 && building._expireTime < getGLOBAL().Timestamp())) {
                currentHealth += building.health;
                maxHealth += building.maxHealth;
            }
        }
        
        return maxPercent - (currentHealth / maxHealth * maxPercent);
    }
}
