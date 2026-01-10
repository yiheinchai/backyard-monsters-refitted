import { Bitmap, BitmapData, MovieClip } from "openfl/display";
import MouseEvent from "openfl/events";
import Point from "openfl/geom";
import getTimer from "openfl/utils";

import { Rndm } from "./com/gskinner/utils/Rndm";
import { ImageCache } from "./com/monsters/display/ImageCache";
import { InstanceManager } from "./com/monsters/managers/InstanceManager";
import { MonsterBase } from "./com/monsters/monsters/MonsterBase";
import { Enrage } from "./com/monsters/monsters/components/abilities/Enrage";
import { TemporaryComponent } from "./com/monsters/monsters/components/abilities/TemporaryComponent";
import { PATHING } from "./com/monsters/pathing/PATHING";
import { WaveObj } from "./com/monsters/replayableEvents/monsterInvasion/WaveObj";
import { Solution } from "./com/monsters/ai/Solution";
import { IPROCESS } from "./com/monsters/ai/IPROCESS";
import { PROCESS3 } from "./com/monsters/ai/PROCESS3";
import { PROCESS4 } from "./com/monsters/ai/PROCESS4";
import { PROCESS5 } from "./com/monsters/ai/PROCESS5";
import { PROCESS7 } from "./com/monsters/ai/PROCESS7";
import { PROCESS_INFERNO1 } from "./com/monsters/ai/PROCESS_INFERNO1";
import { INFERNO_EMERGENCE_PROCESS } from "./com/monsters/ai/INFERNO_EMERGENCE_PROCESS";
import { AIATTACKPOPUP } from "./AIATTACKPOPUP";
import { popup_attacksettings } from "./popup_attacksettings";
import { frame } from "./frame";
import { GLOBAL } from "./GLOBAL";
import { KEYS } from "./KEYS";
import { BASE } from "./BASE";
import { BFOUNDATION } from "./BFOUNDATION";
import { BTOWER } from "./BTOWER";
import { BTRAP } from "./BTRAP";
import { GRID } from "./GRID";
import { MAP } from "./MAP";
import { UI2 } from "./UI2";
import { SOUNDS } from "./SOUNDS";
import { ATTACK } from "./ATTACK";
import { CREEPS } from "./CREEPS";
import { POPUPS } from "./POPUPS";
import { SPRITES } from "./SPRITES";
import { TRIBES } from "./TRIBES";
import { WMBASE } from "./WMBASE";
import { PLANNER } from "./PLANNER";
import { STORE } from "./STORE";
import { HATCHERY } from "./HATCHERY";
import { HATCHERYCC } from "./HATCHERYCC";
import { QUESTS } from "./QUESTS";
import { TUTORIAL } from "./TUTORIAL";
import { LOGGER } from "./LOGGER";
import { SPECIALEVENT } from "./SPECIALEVENT";
import { INFERNO_EMERGENCE_EVENT } from "./INFERNO_EMERGENCE_EVENT";
import { CUSTOMATTACKS } from "./CUSTOMATTACKS";
import { MONSTERBAITER } from "./MONSTERBAITER";

export class WMATTACK {
    public static _history: any;
    public static _lastClick: number = 0;
    public static _solutions: Solution[];
    private static solsProcessed: number;
    public static _attackResolution: number = 16;
    private static processStepResolution: number = 3;
    public static _isAI: boolean = true;
    public static _inProgress: boolean;
    public static _damageBias: number = 200;
    public static _processing: boolean = false;

    public static _monsterKeys: string[] = ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "C11", "C12", "C13", "C14", "C15"];
    public static _looters: string[] = ["C3", "C9", "C14"];
    public static _dps: string[] = ["C1", "C4", "C7", "C8", "C11", "C11"];
    public static _tanks: string[] = ["C2", "C6", "C10", "C12"];
    public static _anything: string[] = ["C1", "C4", "C7", "C8", "C12"];
    public static _fodder: string[] = ["C1", "C1", "C1", "C3", "C8", "C9"];
    public static _kamikaze: string[] = ["C5"];

    public static _infernoMonsterKeys: string[] = ["IC1", "IC2", "IC3", "IC4", "IC5", "IC6", "IC7", "IC8"];
    public static _infernoLooters: string[] = ["IC3", "IC3", "IC3", "IC6"];
    public static _infernoDps: string[] = ["IC1", "IC1", "IC2", "IC3", "IC4", "IC6", "IC7", "IC8"];
    public static _infernoTanks: string[] = ["IC2", "IC2", "IC2", "IC2", "IC7"];
    public static _infernoAnything: string[] = ["IC1", "IC1", "IC1", "IC1", "IC8"];
    public static _infernoHunters: string[] = ["IC1", "IC1", "IC2", "IC5"];
    public static _infernoFodder: string[] = ["IC1", "IC1", "IC1", "IC2", "IC3"];
    public static _infernoKamikaze: string[] = ["IC4"];

    public static _sessionsBetweenAttacks: number = 4;
    public static _minAdvanceWarningTime: number = 30;
    public static _maxAdvanceWarningTime: number = 600;
    public static _attackVolumeAmplifier: number = 1;
    public static _trojanThreshold: number = 2000000;
    public static _hitsPerCreep: number = 30;
    private static attackPreference: number = 0;
    private static intelligence: number = 0.1;
    private static quickly: boolean = false;
    public static _trojan: boolean = false;
    public static _queued: any;
    public static warningPopup: AIATTACKPOPUP;
    private static t: number = 0;
    private static baseIsRepairing: boolean = true;

    public static readonly TYPE_LOOT: number = 1;
    public static readonly TYPE_DAMAGE: number = 2;
    public static readonly TYPE_TOWERS: number = 3;
    public static readonly TYPE_SWARM: number = 4;
    public static readonly TYPE_KAMIKAZE: number = 5;
    public static readonly TYPE_DAVE: number = 6;
    public static readonly TYPE_NERD: number = 7;

    public static processor: IPROCESS;
    public static _type: number = WMATTACK.TYPE_TOWERS;
    public static _attackersBaseID: number = 1;
    public static _rage: number = 0;
    public static _enabled: boolean;
    private static _cleanUpFunc: () => void;
    private static _pointPool: Point[] = [];
    private static _poolIndex: number = 0;
    private static _rngCache: any = {};

    constructor() {}

    public static Setup(data: any): void {
        if (GLOBAL.mode === GLOBAL.e_BASE_MODE.BUILD) {
            WMATTACK._enabled = true;
            if (data == null) {
                data = {};
            }
            WMATTACK._history = data;
            
            if (!WMATTACK._history.sessionsSinceLastAttack) {
                WMATTACK._history.sessionsSinceLastAttack = 0;
            }
            if (!WMATTACK._history || WMATTACK._history.currentid != null) {
                WMATTACK._history = {};
            }
            if (!WMATTACK._history.lastattack) {
                WMATTACK._history.lastattack = 0;
            }
            if (!WMATTACK._history.attackPreference) {
                WMATTACK._history.attackPreference = 0;
            }
            
            WMATTACK._history.sessionsSinceLastAttack += 1;
            
            if (GLOBAL._aiDesignMode) {
                WMATTACK._sessionsBetweenAttacks = 1;
            }
            
            WMATTACK._inProgress = false;
            WMATTACK.setEnd();
            
            if (WMATTACK._history["s1"]) {
                if (WMATTACK._history["s1"].length === 2 && WMATTACK._history["s1"][0] === 1) {
                    WMATTACK._history["s1"][2] = 0;
                }
                if (WMATTACK._history["s1"][0] === 1 && WMATTACK._history["s1"][2] === 0) {
                    WMATTACK._trojan = true;
                }
                if (WMATTACK._history["s1"][0] === 1 && WMATTACK._history.queued !== undefined && WMATTACK._history["s1"][2] === 0) {
                    delete WMATTACK._history.queued;
                }
            }
            
            if (WMATTACK._history.queued !== undefined && WMATTACK._history.queued.type !== undefined && WMATTACK._history.queued.t !== undefined) {
                WMATTACK._queued = WMATTACK._history.queued;
                WMATTACK._type = WMATTACK._queued.type;
                WMATTACK._attackersBaseID = WMATTACK._queued.t;
                if (WMATTACK._queued.warned === undefined) {
                    WMATTACK._queued.warned = 0;
                }
            }
            
            if (WMATTACK._queued && WMATTACK._queued.attack) {
                if (WMATTACK._queued.attack.C100) {
                    WMATTACK._queued.attack.C12 = WMATTACK._queued.attack.C100;
                    delete WMATTACK._queued.attack.C100;
                }
                if (WMATTACK._queued.distances.C100) {
                    WMATTACK._queued.distances.C12 = WMATTACK._queued.distances.C100;
                    delete WMATTACK._queued.distances.C100;
                }
            }
            
            if (GLOBAL.Timestamp() - WMATTACK._history.lastattack > 345600) {
                if (WMATTACK._history["s1"]) {
                    if (WMATTACK._history["s1"][0] !== 1) {
                        WMATTACK._history.nextAttack = new Date().getTime() / 1000 + 60;
                    }
                } else {
                    WMATTACK._history.nextAttack = new Date().getTime() / 1000 + 60;
                }
            } else if (WMATTACK._history.nextAttack === undefined) {
                WMATTACK._attackPreference = WMATTACK._history.attackPreference;
            }
        } else if (GLOBAL.mode === GLOBAL.e_BASE_MODE.ATTACK || GLOBAL.mode === GLOBAL.e_BASE_MODE.VIEW || GLOBAL.mode === GLOBAL.e_BASE_MODE.HELP) {
            WMATTACK._history = data;
        }
    }

    public static DoTests(testNum: number = -1): void {
        switch (testNum) {
            case -1:
                return;
            case 0:
                WMATTACK._history.sessionsSinceLastAttack = 300;
                WMATTACK._history.lastattack = 20;
                WMATTACK._history.queued = {
                    "attack": { "C1": 10 },
                    "attackTime": GLOBAL.Timestamp() + 10,
                    "degrees": 0,
                    "distances": { "C1": 300 }
                };
                break;
            case 1:
                WMATTACK._history.sessionsSinceLastAttack = 300;
                WMATTACK._history.lastattack = 20;
                if (WMATTACK._history.queued) {
                    delete WMATTACK._history.queued;
                }
                break;
            // Additional test cases...
        }
    }

    public static set enabled(value: boolean) {
        WMATTACK._enabled = value;
    }

    public static Tick(): void {
        const activeEvent = SPECIALEVENT.getActiveSpecialEvent();
        
        if (GLOBAL.mode === GLOBAL.e_BASE_MODE.BUILD) {
            activeEvent.Tick();
            
            if (WMATTACK.t % 10 === 0) {
                let towerCount = 0;
                WMATTACK.baseIsRepairing = false;
                const buildings: BFOUNDATION[] = InstanceManager.getInstancesByClass(BFOUNDATION);
                
                for (const building of buildings) {
                    if (!(building instanceof BTRAP) && !(building instanceof BTOWER)) {
                        continue;
                    }
                    towerCount++;
                    if (building.health < building.maxHealth) {
                        WMATTACK.baseIsRepairing = true;
                    }
                }
                
                if (!BASE.isMainYard && towerCount < 10) {
                    WMATTACK.baseIsRepairing = true;
                }
            }
            
            WMATTACK.t += 1;
            
            if (WMATTACK._queued != null && !WMATTACK._inProgress) {
                if (!GLOBAL._catchup && !WMATTACK.warningPopup && !WMATTACK._trojan && 
                    WMATTACK._queued.warned === 0 && !WMATTACK.baseIsRepairing && 
                    BASE._isSanctuary <= GLOBAL.Timestamp() && WMATTACK._enabled && 
                    !activeEvent.EventActive() && !INFERNO_EMERGENCE_EVENT.ShouldRunEvent() && 
                    !PLANNER.isOpen()) {
                    WMATTACK.ShowWarning();
                }
                
                if (!GLOBAL._catchup && !WMATTACK._trojan && WMATTACK._queued.warned === 1 && 
                    !UI2._wildMonsterBar && !WMATTACK._inProgress && !WMATTACK.baseIsRepairing && 
                    BASE._isSanctuary <= GLOBAL.Timestamp() && WMATTACK._enabled && 
                    !activeEvent.EventActive() && !INFERNO_EMERGENCE_EVENT.ShouldRunEvent()) {
                    UI2.Show("wmbar");
                } else if (WMATTACK.baseIsRepairing && !GLOBAL._catchup) {
                    WMATTACK._queued = null;
                    delete WMATTACK._history.queued;
                    if (UI2._wildMonsterBar) {
                        UI2.Hide("wmbar");
                    }
                }
                
                if (!WMATTACK.baseIsRepairing && WMATTACK._queued.attackTime <= GLOBAL.Timestamp() && 
                    WMATTACK._enabled && !PLANNER.isOpen() && BASE._isSanctuary <= GLOBAL.Timestamp()) {
                    if (!WMATTACK._inProgress && !CUSTOMATTACKS._started && !WMATTACK.baseIsRepairing) {
                        WMATTACK.LaunchQueuedAttack();
                    }
                } else if (UI2._wildMonsterBar && !WMATTACK.baseIsRepairing) {
                    UI2._wildMonsterBar.eta_txt.htmlText = KEYS.Get("ai_eta", { "v1": GLOBAL.ToTime(WMATTACK._queued.attackTime - GLOBAL.Timestamp()) });
                }
            } else if (!WMATTACK._inProgress) {
                if (!GLOBAL._catchup && WMATTACK._history.sessionsSinceLastAttack >= WMATTACK._sessionsBetweenAttacks && 
                    !WMATTACK.baseIsRepairing && !WMATTACK._processing && 
                    GLOBAL.Timestamp() > WMATTACK._history.nextAttack && BASE._baseLevel >= 9 && 
                    !WMATTACK._trojan && BASE._isSanctuary <= GLOBAL.Timestamp() && WMATTACK._enabled && 
                    !PLANNER.isOpen() && !activeEvent.EventActive() && !INFERNO_EMERGENCE_EVENT.ShouldRunEvent()) {
                    WMATTACK._processing = true;
                    WMATTACK.Trigger();
                }
            } else if (WMATTACK._inProgress) {
                if (CREEPS._creepCount === 0 && (!activeEvent.active || activeEvent.AllWavesSpawned())) {
                    WMATTACK._cleanUpFunc();
                } else if (GLOBAL.Timestamp() % 10 === 0) {
                    let activeCreeps = 0;
                    for (const creep of CREEPS._creeps) {
                        if (creep._behaviour === GLOBAL.e_BASE_MODE.ATTACK || creep._behaviour === "bounce" || 
                            creep._behaviour === "loot" || creep._behaviour === "heal" || 
                            creep._behaviour === "buff" || creep._behaviour === "hunt") {
                            activeCreeps++;
                        }
                    }
                    if (activeCreeps === 0 && (!activeEvent.active || activeEvent.AllWavesSpawned())) {
                        WMATTACK._cleanUpFunc();
                    }
                }
            }
        }
    }

    public static ShowWarning(): void {
        if (!WMATTACK.warningPopup) {
            WMATTACK.warningPopup = new AIATTACKPOPUP(WMATTACK._queued.type);
            GLOBAL._layerWindows.addChild(WMATTACK.warningPopup);
            WMATTACK.PreloadAttackers();
            BASE.Save();
        }
    }

    public static PreloadAttackers(): void {
        for (const key in WMATTACK._queued.attack) {
            if (WMATTACK._queued.attack[key] > 0) {
                ImageCache.GetImageWithCallBack(SPRITES._sprites[key].key);
            }
        }
    }

    public static HideWarning(): void {
        if (WMATTACK.warningPopup) {
            if (WMATTACK.warningPopup.parent) {
                WMATTACK.warningPopup.parent.removeChild(WMATTACK.warningPopup);
            }
            WMATTACK.warningPopup = null;
        }
    }

    public static ShowAttackSettings(): void {
        const asp = new popup_attacksettings();
        asp.title_txt.htmlText = KEYS.Get("ai_settings_title");
        asp.bMore.SetupKey("ai_settings_more_btn");
        asp.bSame.SetupKey("ai_settings_same_btn");
        asp.bLess.SetupKey("ai_settings_less_btn");
        
        asp.bMore.addEventListener(MouseEvent.CLICK, (e: MouseEvent): void => {
            SOUNDS.Play("click1");
            WMATTACK._attackPreference = 1;
            POPUPS.Next();
            BASE.Save();
        });
        
        asp.bLess.addEventListener(MouseEvent.CLICK, (e: MouseEvent): void => {
            SOUNDS.Play("click1");
            WMATTACK._attackPreference = -1;
            POPUPS.Next();
            BASE.Save();
        });
        
        asp.bSame.addEventListener(MouseEvent.CLICK, (e: MouseEvent): void => {
            SOUNDS.Play("click1");
            WMATTACK._attackPreference = 0;
            POPUPS.Next();
            BASE.Save();
        });
        
        (asp.mcFrame as frame).Setup(true, (e: MouseEvent = null): void => {
            SOUNDS.Play("close");
            POPUPS.Next();
            BASE.Save();
        });
        
        asp.taunt_txt.htmlText = "<b>" + TRIBES.TribeForBaseID(WMATTACK._attackersBaseID).taunt + "</b>";
        ImageCache.GetImageWithCallBack(TRIBES.TribeForBaseID(WMATTACK._attackersBaseID).splash, (url: string, bmd: BitmapData): void => {
            const bitmap = new Bitmap(bmd);
            asp.mcImage.addChild(bitmap);
        });
        
        POPUPS.Push(asp);
    }

    public static Export(): any {
        return WMATTACK._history;
    }

    public static TriggerType(type: number): void {
        let processClass: any = null;
        
        switch (type) {
            case 1:
                processClass = PROCESS3;
                WMATTACK._type = WMATTACK.TYPE_TOWERS;
                break;
            case 2:
                WMATTACK._type = WMATTACK.TYPE_SWARM;
                processClass = PROCESS4;
                break;
            case 3:
                WMATTACK._type = WMATTACK.TYPE_KAMIKAZE;
                processClass = PROCESS5;
                break;
            case 4:
                WMATTACK._type = WMATTACK.TYPE_NERD;
                processClass = PROCESS7;
                break;
            case INFERNO_EMERGENCE_PROCESS.TYPE:
                WMATTACK._type = WMATTACK.TYPE_TOWERS;
                processClass = INFERNO_EMERGENCE_PROCESS;
                break;
        }
        
        WMATTACK._attackersBaseID = 1;
        WMATTACK.processor = new processClass();
        WMATTACK.processor.Trigger(1);
    }

    public static Trigger(quick: boolean = false, intelligence: number = 1): void {
        let processClass: any = null;
        
        if (GLOBAL.mode === GLOBAL.e_BASE_MODE.BUILD && GLOBAL._render && POPUPS.Done()) {
            WMATTACK.intelligence = intelligence;
            WMATTACK.quickly = quick;
            
            if (WMBASE._bases && WMBASE._bases.length > 0) {
                for (const base of WMBASE._bases) {
                    if (base.destroyed === 0 && base.level >= BASE._baseLevel - 10) {
                        WMATTACK._attackersBaseID = base.baseid;
                        if (BASE.isInfernoMainYardOrOutpost) {
                            WMATTACK._type = WMATTACK.TYPE_SWARM;
                            processClass = PROCESS_INFERNO1;
                        } else {
                            WMATTACK._type = base.tribe.type;
                            processClass = base.tribe.process;
                        }
                        break;
                    }
                }
            } else {
                const randomType = Math.floor(Math.random() * 4) + 1;
                WMATTACK._attackersBaseID = randomType * 10;
                
                switch (randomType) {
                    case 1:
                        WMATTACK._type = WMATTACK.TYPE_TOWERS;
                        processClass = PROCESS3;
                        break;
                    case 2:
                        WMATTACK._type = WMATTACK.TYPE_SWARM;
                        processClass = PROCESS4;
                        break;
                    case 3:
                        WMATTACK._type = WMATTACK.TYPE_KAMIKAZE;
                        processClass = PROCESS5;
                        break;
                    case 4:
                        WMATTACK._type = WMATTACK.TYPE_NERD;
                        processClass = PROCESS7;
                        break;
                }
            }
            
            if (!processClass) {
                processClass = PROCESS3;
                WMATTACK._type = WMATTACK.TYPE_TOWERS;
                WMATTACK._attackersBaseID = 1;
            }
            
            WMATTACK.processor = new processClass();
            WMATTACK.processor.Trigger(WMATTACK.intelligence);
        }
    }

    public static Queue(solution: Solution): void {
        let delay: number;
        if (!WMATTACK.quickly) {
            delay = 300;
        } else {
            delay = 5;
        }
        
        const baseValue = BASE._basePoints + BASE._baseValue;
        WMATTACK._queued = {
            "type": WMATTACK._type,
            "attack": solution.attack,
            "attackTime": GLOBAL.Timestamp() + delay,
            "degrees": solution.degrees,
            "distances": solution.distances,
            "warned": 0,
            "t": WMATTACK._attackersBaseID
        };
        
        if (baseValue > WMATTACK._trojanThreshold && !WMATTACK._history["s1"] && !BASE.isMainYard) {
            WMATTACK._trojan = true;
            WMATTACK._history["s1"] = [1, GLOBAL.Timestamp(), 0];
            WMATTACK._queued.attackTime = GLOBAL.Timestamp();
        } else {
            WMATTACK._history.queued = WMATTACK._queued;
        }
        
        WMATTACK._processing = false;
        BASE.Save();
    }

    public static PreemptQueue(): void {
        WMATTACK._queued.attackTime = GLOBAL.Timestamp();
        WMATTACK._type = WMATTACK._queued.type ? WMATTACK._queued.type : 1;
        BASE.Save(0, false, true);
        WMATTACK.Tick();
    }

    public static LaunchQueuedAttack(): void {
        PATHING.ResetCosts();
        WMATTACK.SendAttack(WMATTACK._queued.attack, WMATTACK._queued.degrees, WMATTACK._queued.distances);
    }

    public static SendAttack(attack: any, degrees: number, distances: any): void {
        if (WMATTACK._history) {
            if (WMATTACK._history["s1"] && WMATTACK._history["s1"][0] === 1 && 
                WMATTACK._history["s1"][2] === 0 && !BASE.isInfernoMainYardOrOutpost) {
                WMATTACK._history["s1"][2] = 1;
                WMATTACK._history.lastattack = GLOBAL.Timestamp();
                WMATTACK._trojan = true;
                WMATTACK._queued = null;
                delete WMATTACK._history.queued;
                CUSTOMATTACKS.TrojanHorse();
                return;
            }
        }
        
        WMATTACK.AttackB();
        WMATTACK.AttackC();
        WMATTACK._history.lastattack = GLOBAL.Timestamp();
        WMATTACK._isAI = true;
        
        if (BASE.isInfernoMainYardOrOutpost) {
            SOUNDS.PlayMusic("musicipanic");
        } else {
            SOUNDS.PlayMusic("musicpanic");
        }
        
        const spawnData: any[] = [];
        for (const key in attack) {
            spawnData.push([key, "bounce", attack[key], distances[key], degrees, 0, 0]);
        }
        
        const spawned = WMATTACK.SpawnA(spawnData);
        for (const group of spawned) {
            for (const creep of group) {
                creep._hitLimit = WMATTACK._hitsPerCreep;
            }
        }
        
        if (spawned.length > 0 && spawned[0].length > 0) {
            MAP.FocusTo(spawned[0][0].x, spawned[0][0].y, 1);
        }
    }

    public static Attack(param: string = ""): void {
        WMATTACK.PreemptQueue();
    }

    public static SpawnWave(wave: WaveObj, offsetDegrees: number): any[] {
        const result: any[] = [];
        const direction = wave.direction + offsetDegrees;
        const spread = 250;
        
        const pos = GRID.ToISO(
            Math.cos(direction * 0.0174532925) * (800 + spread / 2),
            Math.sin(direction * 0.0174532925) * (800 + spread / 2),
            0
        );
        const focusPos = GRID.ToISO(
            Math.cos(direction * 0.0174532925) * 900,
            Math.sin(direction * 0.0174532925) * 900,
            0
        );
        
        if (wave.powerLevel) {
            GLOBAL._wmCreaturePowerups[wave.creatureID] = wave.powerLevel;
        }
        
        const creeps = WMATTACK.SpawnCreep(pos, spread, wave.creatureID, wave.numCreep, wave.behavior, wave.level);
        result.push(creeps);
        
        if (wave.cameraFocus) {
            MAP.FocusTo(focusPos.x, focusPos.y, 1, 0, 0, true);
        }
        
        return result;
    }

    public static SpawnCreep(pos: Point, spread: number, creatureID: string, count: number, behavior: string, level: number = 0): any[] {
        const rng = new Rndm(Math.floor(pos.x + pos.y));
        const gridPos = GRID.FromISO(pos.x, pos.y);
        const result: any[] = [];
        
        for (let i = 0; i < count; i++) {
            const angle = rng.random() * 360 * 0.0174532925;
            const dist = rng.random() * spread / 2;
            const spawnPos = gridPos.add(new Point(Math.cos(angle) * dist, Math.sin(angle) * dist));
            
            let creep: MonsterBase;
            if (creatureID.substr(0, 1) === "G") {
                creep = CREEPS.SpawnGuardian(parseInt(creatureID.substr(1)), MAP._BUILDINGTOPS, "bounce", level, GRID.ToISO(spawnPos.x, spawnPos.y, 0), rng.random() * 360, Number.MAX_SAFE_INTEGER, 0, 3, true);
            } else {
                creep = CREEPS.Spawn(creatureID, MAP._BUILDINGTOPS, "bounce", GRID.ToISO(spawnPos.x, spawnPos.y, 0), rng.random() * 360);
            }
            
            creep._hitLimit = Number.MAX_SAFE_INTEGER;
            
            if (WMATTACK._rage) {
                creep.addComponent(new TemporaryComponent(new Enrage(2, 0), WMATTACK._rage));
            }
            
            result.push(creep);
        }
        
        return result;
    }

    private static getPooledPoint(x: number, y: number): Point {
        if (WMATTACK._poolIndex >= WMATTACK._pointPool.length) {
            WMATTACK._pointPool.push(new Point());
        }
        const point = WMATTACK._pointPool[WMATTACK._poolIndex++];
        point.x = x;
        point.y = y;
        return point;
    }

    public static SpawnA(spawnData: any[]): any[] {
        WMATTACK._poolIndex = 0;
        const result: any[] = [];
        const groupSize = 3;
        
        for (let i = 0; i < spawnData.length; i++) {
            let degrees = spawnData[i][4];
            
            if (WMATTACK._type === WMATTACK.TYPE_SWARM) {
                let count = 0;
                while (count < spawnData[i][2]) {
                    degrees += 8;
                    const pos = GRID.ToISO(
                        Math.cos(degrees * 0.0174532925) * (800 + spawnData[i][3] / 2),
                        Math.sin(degrees * 0.0174532925) * (800 + spawnData[i][3] / 2),
                        0
                    );
                    const creeps = WMATTACK.SpawnB(pos, spawnData[i][3], spawnData[i][0], groupSize, spawnData[i][1]);
                    result.push(creeps);
                    count += groupSize;
                }
                
                if (spawnData[i][2] % groupSize !== 0) {
                    const pos = GRID.ToISO(
                        Math.cos(degrees * 0.0174532925) * (800 + spawnData[i][3] / 2),
                        Math.sin(degrees * 0.0174532925) * (800 + spawnData[i][3] / 2),
                        0
                    );
                    const creeps = WMATTACK.SpawnB(pos, spawnData[i][3], spawnData[i][0], spawnData[i][2] % groupSize, spawnData[i][1]);
                    result.push(creeps);
                }
            } else {
                const pos = GRID.ToISO(
                    Math.cos(degrees * 0.0174532925) * (800 + spawnData[i][3] / 2),
                    Math.sin(degrees * 0.0174532925) * (800 + spawnData[i][3] / 2),
                    0
                );
                const creeps = WMATTACK.SpawnB(pos, spawnData[i][3], spawnData[i][0], spawnData[i][2], spawnData[i][1]);
                result.push(creeps);
            }
            
            if (spawnData[i][6] === 1) {
                const focusPos = GRID.ToISO(
                    Math.cos(degrees * 0.0174532925) * 900,
                    Math.sin(degrees * 0.0174532925) * 900,
                    0
                );
                MAP.Focus(focusPos.x, focusPos.y);
            }
        }
        
        return result;
    }

    public static SpawnB(pos: Point, spread: number, creatureID: string, count: number, behavior: string): any[] {
        const baseValue = BASE._basePoints + BASE._baseValue;
        let scaleFactor = 0.4;
        
        if (baseValue > 1000000) scaleFactor = 0.5;
        if (baseValue > 3000000) scaleFactor = 0.6;
        if (baseValue > 6000000) scaleFactor = 0.7;
        if (baseValue > 15000000) scaleFactor = 0.8;
        if (baseValue > 50000000) scaleFactor = 0.9;
        
        const seedValue = Math.floor(pos.x + pos.y);
        let rng = WMATTACK._rngCache[seedValue];
        if (!rng) {
            rng = WMATTACK._rngCache[seedValue] = new Rndm(seedValue);
        }
        
        const gridPos = GRID.FromISO(pos.x, pos.y);
        const result: any[] = [];
        
        for (let i = 0; i < count; i++) {
            const angle = rng.random() * 360 * 0.0174532925;
            const dist = rng.random() * spread / 2;
            const offsetPoint = WMATTACK.getPooledPoint(Math.cos(angle) * dist, Math.sin(angle) * dist);
            const spawnPos = gridPos.add(offsetPoint);
            
            const creep = CREEPS.Spawn(creatureID, MAP._BUILDINGTOPS, "bounce", GRID.ToISO(spawnPos.x, spawnPos.y, 0), rng.random() * 360, scaleFactor, true);
            
            if (WMATTACK._rage) {
                creep.addComponent(new TemporaryComponent(new Enrage(2, 0), WMATTACK._rage));
            }
            
            result.push(creep);
        }
        
        return result;
    }

    public static AttackB(): void {
        WMATTACK.HideWarning();
        WMATTACK._inProgress = true;
        ATTACK.Setup();
        BASE._blockSave = true;
        UI2.Hide("top");
        UI2.Hide("wmbar");
        UI2.Hide("bottom");
        UI2.Show("warning");
        UI2._warning.Update("<font size=\"28\">" + KEYS.Get("msg_dontpanic") + "</font>");
        PLANNER.Hide();
        STORE.Hide();
        HATCHERY.Hide();
        HATCHERYCC.Hide();
    }

    public static AttackC(): void {
        WMATTACK._queued = null;
    }

    public static setEnd(cleanupFunc: () => void = null): void {
        if (cleanupFunc) {
            WMATTACK._cleanUpFunc = cleanupFunc;
        } else {
            WMATTACK._cleanUpFunc = WMATTACK.CleanUp;
        }
    }

    public static CleanUp(): void {
        WMATTACK._inProgress = false;
        UI2.Show("top");
        UI2.Show("bottom");
        UI2.Hide("warning");
        UI2.Hide("scareAway");
        WMATTACK.warningPopup = null;
        
        if (WMATTACK._history["s1"] && WMATTACK._history["s1"][0] === 1) {
            WMATTACK._history["s1"][0] = 2;
            WMATTACK._trojan = false;
        }
        
        if (WMATTACK._isAI) {
            WMATTACK.ResetWait();
        }
        
        if (BASE.isInfernoMainYardOrOutpost) {
            SOUNDS.PlayMusic("musicibuild");
        } else {
            SOUNDS.PlayMusic("musicbuild");
        }
        
        let currentHealth = 0;
        let maxHealth = 0;
        const buildings: BFOUNDATION[] = InstanceManager.getInstancesByClass(BFOUNDATION);
        
        for (const building of buildings) {
            building.GridCost(true);
            if (building._class !== "trap" && building._class !== "wall" && building._repairing !== 1) {
                currentHealth += building.health;
                maxHealth += building.maxHealth;
            }
            if (building.health < building.maxHealth && building._repairing === 0) {
                building.Repair();
            }
        }
        
        BASE._blockSave = false;
        BASE.Save();
        
        if (MONSTERBAITER._scaredAway) {
            MONSTERBAITER._scaredAway = false;
            CUSTOMATTACKS._started = false;
            QUESTS.Check();
            MONSTERBAITER._attacking = 0;
            return;
        }
        
        const activeEvent = SPECIALEVENT.getActiveSpecialEvent();
        if (activeEvent.active) {
            if (CREEPS._creepCount > 0 || !activeEvent.AllWavesSpawned() || currentHealth <= maxHealth * 0.1) {
                ATTACK.PoorDefense();
            } else {
                ATTACK.WellDefended(true);
            }
        } else if (currentHealth < maxHealth * 0.9 || TUTORIAL._stage < 200) {
            ATTACK.PoorDefense();
        } else if (currentHealth >= maxHealth * 0.9) {
            ATTACK.WellDefended(true);
        }
        
        CUSTOMATTACKS._started = false;
        QUESTS.Check();
        MONSTERBAITER._attacking = 0;
        
        if (WMATTACK._isAI && WMATTACK.intelligence > 0) {
            WMATTACK.ShowAttackSettings();
        }
    }

    public static CleanUpLite(): void {
        WMATTACK._inProgress = false;
        UI2.Show("top");
        UI2.Show("bottom");
        UI2.Hide("warning");
        UI2.Hide("scareAway");
        WMATTACK.warningPopup = null;
        
        if (WMATTACK._history["s1"] && WMATTACK._history["s1"][0] === 1) {
            WMATTACK._history["s1"][0] = 2;
            WMATTACK._trojan = false;
        }
        
        if (WMATTACK._isAI) {
            WMATTACK.ResetWait();
        }
        
        if (BASE.isInfernoMainYardOrOutpost) {
            SOUNDS.PlayMusic("musicibuild");
        } else {
            SOUNDS.PlayMusic("musicbuild");
        }
        
        const buildings: BFOUNDATION[] = InstanceManager.getInstancesByClass(BFOUNDATION);
        for (const building of buildings) {
            building.GridCost(true);
            if (building._repairing !== 1) {
                if (building.health < building.maxHealth) {
                    building.Repair();
                }
            }
        }
        
        BASE._blockSave = false;
        BASE.Save();
        MONSTERBAITER._scaredAway = false;
        CUSTOMATTACKS._started = false;
        QUESTS.Check();
        MONSTERBAITER._attacking = 0;
    }

    public static End(): void {
        WMATTACK.Tick();
        
        if (BASE.isInfernoMainYardOrOutpost) {
            SOUNDS.PlayMusic("musicibuild");
        } else {
            SOUNDS.PlayMusic("musicbuild");
        }
        
        UI2.Show("top");
        UI2.Show("bottom");
        UI2.Hide("warning");
        UI2.Hide("scareAway");
        
        let currentHealth = 0;
        let maxHealth = 0;
        const buildings: BFOUNDATION[] = InstanceManager.getInstancesByClass(BFOUNDATION);
        
        for (const building of buildings) {
            building.GridCost(true);
            if (building._repairing !== 1) {
                if (building._class !== "trap" && building._class !== "wall") {
                    currentHealth += building.health;
                    maxHealth += building.maxHealth;
                }
                if (building.health < building.maxHealth) {
                    building.Repair();
                }
            }
        }
        
        BASE._blockSave = false;
        BASE.Save();
        
        if (MONSTERBAITER._scaredAway && currentHealth < maxHealth) {
            ATTACK.PoorDefense();
        } else if (currentHealth < maxHealth * 0.9 || TUTORIAL._stage < 200) {
            ATTACK.PoorDefense();
        } else if (currentHealth >= maxHealth * 0.9) {
            if (!MONSTERBAITER._scaredAway) {
                ATTACK.WellDefended(true);
            }
        }
        
        MONSTERBAITER._scaredAway = false;
        QUESTS.Check();
        MONSTERBAITER._attacking = 0;
    }

    public static ResetWait(): void {
        if (WMATTACK._history.nextAttack) {
            delete WMATTACK._history.nextAttack;
        }
        if (WMATTACK._history.queued) {
            delete WMATTACK._history.queued;
        }
        WMATTACK._history.sessionsSinceLastAttack = 0;
    }

    public static get _attackPreference(): number {
        return WMATTACK.attackPreference;
    }

    public static set _attackPreference(value: number) {
        switch (value) {
            case -1:
                WMATTACK._history.nextAttack = WMATTACK._history.lastattack + 345600;
                WMATTACK._attackVolumeAmplifier = 0.5;
                WMATTACK._hitsPerCreep = 20;
                WMATTACK._history.attackPreference = -1;
                if (BASE.isInfernoMainYardOrOutpost) {
                    LOGGER.Stat([89, "slow"]);
                }
                break;
            case 0:
            default:
                WMATTACK._history.nextAttack = WMATTACK._history.lastattack + 259200;
                WMATTACK._attackVolumeAmplifier = 1;
                WMATTACK._hitsPerCreep = 30;
                WMATTACK._history.attackPreference = 0;
                if (BASE.isInfernoMainYardOrOutpost) {
                    LOGGER.Stat([89, "med"]);
                }
                break;
            case 1:
                WMATTACK._history.nextAttack = WMATTACK._history.lastattack + 172800;
                WMATTACK._attackVolumeAmplifier = 1.3;
                WMATTACK._hitsPerCreep = 50;
                WMATTACK._history.attackPreference = 1;
                if (BASE.isInfernoMainYardOrOutpost) {
                    LOGGER.Stat([89, "fast"]);
                }
                break;
        }
        BASE.Save();
    }

    public static dpsAtPoint(solution: Solution, point: Point): number {
        const gridPoint = GRID.FromISO(point.x, point.y);
        let totalDps = 0;
        const towers: BTOWER[] = InstanceManager.getInstancesByClass(BTOWER);
        
        for (const tower of towers) {
            if (tower._countdownUpgrade.Get() === 0 && tower._countdownBuild.Get() === 0 && tower._countdownFortify.Get()) {
                const towerPos = GRID.FromISO(tower.x, tower.y);
                towerPos.add(new Point(tower._footprint[0].width * 0.5, tower._footprint[0].height * 0.5));
                const distance = Point.distance(towerPos, gridPoint);
                
                if (distance < tower._range) {
                    totalDps += tower.damage / tower._rate;
                    solution.towersInPath.push(tower);
                }
            }
        }
        
        return totalDps;
    }
}
