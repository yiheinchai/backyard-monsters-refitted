import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';
import { TweenLite, Quad } from './gs';
import { SecNum } from './com/cc/utils/SecNum';
import { BYMConfig } from './com/monsters/configs/BYMConfig';
import { ITargetable } from './com/monsters/interfaces/ITargetable';
import { ChampionBase } from './com/monsters/monsters/champions/ChampionBase';
import { Fomor } from './com/monsters/monsters/champions/Fomor';
import { Korath } from './com/monsters/monsters/champions/Korath';
import { Krallen } from './com/monsters/monsters/champions/Krallen';
import { ProximityLootBuff } from './com/monsters/monsters/components/abilities/ProximityLootBuff';
import { BFOUNDATION } from './BFOUNDATION';
import { CHAMPIONCAGEPOPUP } from './CHAMPIONCAGEPOPUP';
import { CHAMPIONSELECTPOPUP } from './CHAMPIONSELECTPOPUP';
import { CHAMPIONNAMEPOPUP } from './CHAMPIONNAMEPOPUP';
import { MONSTERBAITER } from './MONSTERBAITER';
import { ACHIEVEMENTS } from './ACHIEVEMENTS';
import { md5 } from './md5';
import { JSON as JSONUtil } from './JSON';

// Lazy imports to break circular dependency chains
function getInstanceManager(): any { return require("./com/monsters/managers/InstanceManager").InstanceManager; }
function getMapRoomManager(): any { return require("./com/monsters/maproom_manager/MapRoomManager").MapRoomManager; }
function getMonsterBase(): any { return require("./com/monsters/monsters/MonsterBase").MonsterBase; }
function getCHAMPIONCHAMBER(): any { return require("./CHAMPIONCHAMBER").CHAMPIONCHAMBER; }
function getCREATURES(): any { return require("./CREATURES").CREATURES; }
function getCREEPS(): any { return require("./CREEPS").CREEPS; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getBASE(): any { return require("./BASE").BASE; }
function getMAP(): any { return require("./MAP").MAP; }
function getGRID(): any { return require("./GRID").GRID; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getHOUSING(): any { return require("./HOUSING").HOUSING; }
function getHOUSINGBUNKER(): any { return require("./HOUSINGBUNKER").HOUSINGBUNKER; }
function getBUILDING15(): any { return require("./BUILDING15").BUILDING15; }
function getWMATTACK(): any { return require("./WMATTACK").WMATTACK; }
function getQUESTS(): any { return require("./QUESTS").QUESTS; }
function getLOGGER(): any { return require("./LOGGER").LOGGER; }


/**
 * CHAMPIONCAGE - Champion cage building for managing guardians
 * Converted from ActionScript to TypeScript
 */
export class CHAMPIONCAGE extends BFOUNDATION {
    public static readonly TYPE: number = 114;
    public static doesShowKrallen: boolean = false;
    public static STARVETIMER: number = 3600 * 24;
    public static readonly CLASS_TYPE_BASIC: number = 1;
    public static readonly CLASS_TYPE_SPECIAL: number = 2;
    public static readonly CHAMPION_ID_KRALLEN: number = 5;

    public static _housed: any;
    public static _popup: CHAMPIONCAGEPOPUP | null = null;
    public static _select: CHAMPIONSELECTPOPUP | null = null;
    public static _namepopup: CHAMPIONNAMEPOPUP | null = null;
    public static _open: boolean = false;

    public static _guardians: any = {
        "length": 5,
        "G1": {
            "name": "Gorgo",
            "description": "mon_gorgodesc",
            "title": "mon_gorgotitle",
            "selectGraphic": "popups/guardian_select_gorgo.png",
            "classType": CHAMPIONCAGE.CLASS_TYPE_BASIC,
            "spawnClass": ChampionBase,
            "props": {
                "speed": [1, 1.2, 1.4, 1.6, 1.8, 2],
                "health": [40000, 80000, 120000, 140000, 160000, 200000],
                "healtime": [3600, 7200, 14400, 28800, 57600, 115200],
                "range": [35, 45, 55, 65, 70, 70],
                "damage": [1000, 1200, 1500, 2000, 2500, 3000],
                "feeds": [{"C2": 8}, {"C2": 5, "C6": 3}, {"C6": 20}, {"C6": 5, "C10": 5}, {"C10": 10}],
                "feedShiny": [26, 44, 75, 111, 136],
                "evolveShiny": [158, 530, 1358, 2664, 4076],
                "feedCount": [3, 6, 9, 12, 15],
                "feedTime": [3600 * 23],
                "buffs": [0],
                "movement": ["ground"],
                "attack": ["melee"],
                "bucket": [240],
                "offset_x": [-48, -38, -42, -52, -54, -46],
                "offset_y": [-38, -36, -52, -82, -98, -80],
                "bonusSpeed": [0.1, 0.2, 0.4],
                "bonusHealth": [12500, 27500, 50000],
                "bonusRange": [0, 0, 0],
                "bonusDamage": [150, 330, 600],
                "bonusBuffs": [0, 0, 0],
                "bonusFeeds": [{"C10": 10}, {"C10": 10}, {"C10": 10}],
                "powerLevel": 1,
                "bonusFeedShiny": [136, 136, 136],
                "bonusFeedTime": [3600 * 24],
                "abilities": [null],
                "targetGroup": [0]
            }
        },
        "G2": {
            "name": "Drull",
            "description": "mon_drulldesc",
            "title": "mon_drulltitle",
            "selectGraphic": "popups/guardian_select_drull.png",
            "classType": CHAMPIONCAGE.CLASS_TYPE_BASIC,
            "spawnClass": ChampionBase,
            "props": {
                "speed": [2, 2.2, 2.5, 2.8, 3.2, 3.6],
                "health": [12000, 20000, 36000, 42000, 52000, 60000],
                "healtime": [3600, 7200, 14400, 28800, 57600, 115200],
                "range": [35, 45, 55, 65, 85, 90],
                "damage": [3000, 3600, 4200, 5500, 6500, 8000],
                "feeds": [{"C1": 15}, {"C1": 10, "C4": 8}, {"C7": 25}, {"C7": 5, "C8": 18}, {"C8": 15}],
                "feedShiny": [26, 44, 75, 105, 131],
                "evolveShiny": [158, 530, 1358, 2530, 3918],
                "feedCount": [3, 6, 9, 12, 15],
                "feedTime": [3600 * 23],
                "buffs": [0],
                "movement": ["ground"],
                "attack": ["melee"],
                "bucket": [180],
                "offset_x": [-32, -38, -52, -56, -64, -70],
                "offset_y": [-28, -36, -50, -52, -68, -76],
                "bonusSpeed": [0.1, 0.2, 0.4],
                "bonusHealth": [2500, 5500, 10000],
                "bonusRange": [0, 0, 0],
                "bonusDamage": [400, 880, 1600],
                "bonusBuffs": [0, 0, 0],
                "bonusFeeds": [{"C8": 15}, {"C8": 15}, {"C8": 15}],
                "powerLevel": 1,
                "bonusFeedShiny": [131, 131, 131],
                "bonusFeedTime": [3600 * 24],
                "abilities": [null],
                "targetGroup": [0]
            }
        },
        "G3": {
            "name": "Fomor",
            "description": "mon_fomordesc",
            "title": "mon_fomortitle",
            "selectGraphic": "popups/guardian_select_fomor.png",
            "classType": CHAMPIONCAGE.CLASS_TYPE_BASIC,
            "spawnClass": Fomor,
            "props": {
                "speed": [1.2, 1.4, 2, 2.1, 2.2, 2.3],
                "health": [15000, 17500, 20000, 22500, 25000, 40000],
                "healtime": [3600, 7200, 14400, 28800, 57600, 115200],
                "range": [140, 140, 180, 190, 200, 210],
                "damage": [70, 80, 90, 100, 110, 120],
                "feeds": [{"C3": 10}, {"C3": 10, "C9": 1}, {"C3": 20, "C9": 3}, {"C3": 15, "C9": 5}, {"C9": 10}],
                "feedShiny": [26, 45, 62, 76, 96],
                "evolveShiny": [154, 537, 1116, 1822, 2891],
                "feedCount": [3, 6, 9, 12, 15],
                "feedTime": [3600 * 23],
                "buffs": [0.1, 0.2, 0.3, 0.4, 0.5, 0.6],
                "movement": ["ground", "ground", "fly"],
                "attack": ["ranged"],
                "bucket": [200],
                "offset_x": [-20, -38, -52, -56, -60, -58],
                "offset_y": [-21, -36, -50, -52, -68, -98],
                "bonusSpeed": [0.1, 0.2, 0.4],
                "bonusHealth": [1000, 2200, 4000],
                "bonusRange": [3, 6, 10],
                "bonusDamage": [3, 6, 10],
                "bonusBuffs": [0.03, 0.06, 0.15],
                "bonusFeeds": [{"C9": 10}, {"C9": 10}, {"C9": 10}],
                "powerLevel": 1,
                "bonusFeedShiny": [96, 96, 96],
                "bonusFeedTime": [3600 * 24],
                "abilities": [null],
                "targetGroup": [0]
            }
        },
        "G4": {
            "name": "Korath",
            "description": "mon_korathdesc",
            "title": "mon_korathtitle",
            "selectGraphic": "popups/guardian_select_korath.v2.png",
            "classType": CHAMPIONCAGE.CLASS_TYPE_BASIC,
            "spawnClass": Korath,
            "powerLevel2Desc": "mon_korathdesc_fireball",
            "powerLevel3Desc": "mon_korathdesc_stomp",
            "props": {
                "speed": [1.4, 1.6, 1.8, 2, 2.3, 2.5],
                "health": [28000, 62000, 96000, 120000, 144000, 175000],
                "healtime": [3600, 7200, 14400, 28800, 57600, 115200],
                "range": [35, 45, 55, 60, 65, 65],
                "damage": [2000, 2400, 3000, 3800, 5000, 6500],
                "feeds": [{"IC1": 10, "IC2": 5}, {"IC2": 5, "IC7": 1}, {"IC7": 3}, {"IC7": 5}, {"IC8": 2}],
                "feedShiny": [26, 44, 75, 111, 136],
                "evolveShiny": [158, 530, 1358, 2664, 4076],
                "feedCount": [3, 6, 9, 12, 15],
                "feedTime": [3600 * 23],
                "buffs": [0],
                "movement": ["ground"],
                "attack": ["melee"],
                "bucket": [200],
                "offset_x": [-36, -61, -52, -62, -81, -70],
                "offset_y": [-35, -49, -70, -95, -126, -130],
                "bonusSpeed": [0.1, 0.2, 0.4],
                "bonusHealth": [1000, 2200, 4000],
                "bonusRange": [0, 0, 0],
                "bonusDamage": [300, 600, 1000],
                "bonusBuffs": [0],
                "bonusFeeds": [{"IC8": 2}, {"IC8": 2}, {"IC8": 2}],
                "powerLevel": 0,
                "bonusFeedShiny": [96, 96, 96],
                "bonusFeedTime": [3600 * 24],
                "abilities": [null],
                "targetGroup": [0]
            }
        },
        "G5": {
            "name": "Krallen",
            "description": "mon_krallendesc",
            "title": "mon_gorgotitle",
            "selectGraphic": "popups/guardian_select_korath.v2.png",
            "classType": CHAMPIONCAGE.CLASS_TYPE_SPECIAL,
            "spawnClass": Krallen,
            "powerLevel2Desc": "mon_korathdesc_fireball",
            "powerLevel3Desc": "mon_korathdesc_stomp",
            "props": {
                "speed": [2.2, 2.3, 2.4, 2.5, 2.6],
                "health": [50000, 52000, 54000, 58000, 62000],
                "healtime": [7200, 14400, 28800, 57600, 115200],
                "range": [35, 45, 55, 60, 65],
                "damage": [800, 850, 900, 1000, 1200],
                "feeds": [{"IC1": 20, "IC2": 10}, {"IC2": 10, "IC7": 2}, {"IC7": 6}, {"IC7": 10}, {"IC8": 3}],
                "feedShiny": [26, 44, 75, 111, 136],
                "evolveShiny": [158, 530, 1358, 2664],
                "feedCount": [3, 6, 9, 12, 15],
                "feedTime": [3600 * 23],
                "buffs": [0.2, 0.22, 0.24, 0.27, 0.3],
                "buffRadius": [250, 275, 300, 325, 350],
                "movement": ["ground"],
                "attack": ["melee"],
                "bucket": [200],
                "offset_x": [-64, -61, -52, -52, -52],
                "offset_y": [-50, -60, -72, -72, -72],
                "bonusSpeed": [0, 0, 0],
                "bonusHealth": [0, 0, 0],
                "bonusRange": [0, 0, 0],
                "bonusDamage": [0, 0, 0],
                "bonusBuffs": [0],
                "bonusFeeds": [{"IC8": 3}, {"IC8": 3}, {"IC8": 3}],
                "powerLevel": 0,
                "bonusFeedShiny": [96, 96, 96],
                "bonusFeedTime": [3600 * 24],
                "abilities": [null, null, ProximityLootBuff],
                "targetGroup": [0]
            }
        }
    };

    constructor() {
        super();
        this._type = 114;
        this._footprint = [new Rectangle(0, 0, 160, 160)];
        this._gridCost = [[new Rectangle(10, 10, 140, 20), 400], [new Rectangle(130, 30, 20, 120), 400], [new Rectangle(10, 30, 20, 120), 400], [new Rectangle(30, 130, 30, 20), 400], [new Rectangle(100, 130, 30, 20), 400]];
        this.SetProps();
        this.setFeedProps();
    }

    public static PointInCage(param1: Point): Point {
        const _loc2_: Rectangle = new Rectangle(40, 40, 40, 40);
        return getGRID().ToISO(param1.x + (_loc2_.x + Math.random() * _loc2_.width), param1.y + (_loc2_.y + Math.random() * _loc2_.height), 0);
    }

    public static GetFeedTime(): number {
        if (getCREATURES()._guardian) {
            return getCREATURES()._guardian._feedTime.Get();
        }
        return 0;
    }

    public static GetNumFeeds(): number {
        if (getCREATURES()._guardian) {
            return getCREATURES()._guardian._feeds.Get();
        }
        return 0;
    }

    public static ShowJuice(): void {
        getGLOBAL().Message(getKEYS().Get("msg_juicechampion_confirm"), getKEYS().Get("msg_juicechampion_yes"), CHAMPIONCAGE.JuiceChampion);
    }

    public static JuiceChampion(): void {
        if (getCREATURES()._guardian) {
            getCREATURES()._guardian.changeModeJuice();
        }
    }

    private static hasBasicChampion(): boolean {
        let _loc1_: number = 0;
        let _loc2_: number = 0;
        while (_loc2_ < getBASE()._guardianData.length) {
            _loc1_ = getBASE()._guardianData[_loc2_].status ? Number(getBASE()._guardianData[_loc2_].status) : ChampionBase.k_CHAMPION_STATUS_NORMAL;
            if (_loc1_ == ChampionBase.k_CHAMPION_STATUS_NORMAL && CHAMPIONCAGE._guardians["G" + getBASE()._guardianData[_loc2_].t].classType == CHAMPIONCAGE.CLASS_TYPE_BASIC) {
                return true;
            }
            _loc2_++;
        }
        return false;
    }

    public static Show(): void {
        let _loc1_: number = 0;
        let _loc2_: any;
        if (!CHAMPIONCAGE._open) {
            CHAMPIONCAGE._open = true;
            getGLOBAL().BlockerAdd();
            if (!CHAMPIONCAGE.hasBasicChampion()) {
                CHAMPIONCAGE._select = getGLOBAL()._layerWindows.addChild(new CHAMPIONSELECTPOPUP()) as CHAMPIONSELECTPOPUP;
                CHAMPIONCAGE._select.Center();
                CHAMPIONCAGE._select.ScaleUp();
            } else {
                _loc1_ = 0;
                for (_loc2_ of getBASE()._guardianData) {
                    if (_loc2_.status == ChampionBase.k_CHAMPION_STATUS_NORMAL) {
                        _loc1_++;
                    }
                }
                if (getCREATURES()._guardianList.length < getBASE()._guardianDataNumNormal()) {
                    CHAMPIONCAGE.spawnAllGuardians();
                }
                CHAMPIONCAGE._popup = getGLOBAL()._layerWindows.addChild(new CHAMPIONCAGEPOPUP()) as CHAMPIONCAGEPOPUP;
                CHAMPIONCAGE._popup.Center();
                CHAMPIONCAGE._popup.ScaleUp();
            }
        }
    }

    private static spawnAllGuardians(): void {
        let _loc1_: number = 0;
        while (_loc1_ < getBASE()._guardianData.length) {
            if (getBASE()._guardianData[_loc1_] && getBASE()._guardianData[_loc1_].t && getBASE()._guardianData[_loc1_].status === ChampionBase.k_CHAMPION_STATUS_NORMAL) {
                getGLOBAL()._bCage.SpawnGuardian(getBASE()._guardianData[_loc1_].l.Get(), getBASE()._guardianData[_loc1_].fd, getBASE()._guardianData[_loc1_].ft, getBASE()._guardianData[_loc1_].t, getBASE()._guardianData[_loc1_].hp.Get(), getBASE()._guardianData[_loc1_].nm, getBASE()._guardianData[_loc1_].fb.Get(), getBASE()._guardianData[_loc1_].pl.Get());
            }
            _loc1_++;
        }
    }

    public static ShowName(): void {
        if (!CHAMPIONCAGE._namepopup && getCREATURES()._guardian) {
            CHAMPIONCAGE._namepopup = new CHAMPIONNAMEPOPUP();
            getPOPUPS().Push(CHAMPIONCAGE._namepopup, null, null, null);
        }
    }

    public static Hide(param1: MouseEvent | null = null): void {
        if (CHAMPIONCAGE._open) {
            getGLOBAL().BlockerRemove();
            getSOUNDS().Play("close");
            getBASE().BuildingDeselect();
            CHAMPIONCAGE._open = false;
            if (CHAMPIONCAGE._select) {
                getGLOBAL()._layerWindows.removeChild(CHAMPIONCAGE._select);
                CHAMPIONCAGE._select = null;
                if (getCREATURES()._guardian) {
                    CHAMPIONCAGE._popup = getGLOBAL()._layerWindows.addChild(new CHAMPIONCAGEPOPUP()) as CHAMPIONCAGEPOPUP;
                    CHAMPIONCAGE._popup.scaleX = CHAMPIONCAGE._popup.scaleY = 0.8;
                    CHAMPIONCAGE._popup.x = getGLOBAL()._SCREENCENTER.x;
                    CHAMPIONCAGE._popup.y = getGLOBAL()._SCREENCENTER.y;
                    TweenLite.to(CHAMPIONCAGE._popup, 0.2, {
                        "scaleX": 1,
                        "scaleY": 1,
                        "ease": Quad.easeOut
                    });
                    CHAMPIONCAGE._open = true;
                    return;
                }
            }
            if (CHAMPIONCAGE._popup) {
                getGLOBAL()._layerWindows.removeChild(CHAMPIONCAGE._popup);
                CHAMPIONCAGE._popup = null;
            }
            if (CHAMPIONCAGE._namepopup) {
                getPOPUPS().Next();
                CHAMPIONCAGE._namepopup = null;
            }
        }
    }

    public static GetGuardianProperty(param1: string, param2: number, param3: string): any {
        let _loc5_: any;
        let _loc6_: number = 0;
        const _loc4_: any = CHAMPIONCAGE._guardians[param1];
        if (_loc4_) {
            _loc5_ = _loc4_.props;
            if (_loc5_[param3]) {
                _loc6_ = Number(_loc5_[param3].length);
                if (param2 > _loc6_) {
                    return _loc5_[param3][_loc6_ - 1];
                }
                return _loc5_[param3][param2 - 1];
            }
        }
        return null;
    }

    public static GetGuardianProperties(param1: string, param2: string): any[] | null {
        const _loc3_: any = CHAMPIONCAGE._guardians[param1];
        if (_loc3_) {
            return _loc3_.props[param2];
        }
        return null;
    }

    public static HealGuardian(param1: number = 0): void {
        if (param1 != 0 && getCREATURES().getGuardian(param1)) {
            getCREATURES().getGuardian(param1).heal();
        } else if (getCREATURES()._guardian) {
            getCREATURES()._guardian.heal();
        }
    }

    public static Check(): string {
        let tmpArray: any[] = [];
        const Push = (param1: number): void => {
            const _loc2_: any = CHAMPIONCAGE._guardians["G" + param1];
            const _loc3_: any = _loc2_.props;
            tmpArray.push([_loc3_.movement, _loc3_.attack, _loc3_.speed, _loc3_.health, _loc3_.damage, _loc3_.healtime, _loc3_.feedCount, _loc3_.feedShiny, _loc3_.evolveShiny, _loc3_.feedTime, _loc3_.bucket, _loc3_.buffs, _loc3_.range, _loc3_.bonusSpeed, _loc3_.bonusHealth, _loc3_.bonusRange, _loc3_.bonusDamage, _loc3_.bonusFeedShiny, _loc3_.bonusFeedTime, _loc3_.bonusBuffs]);
        };
        let i: number = 1;
        while (i <= 3) {
            Push(i);
            i++;
        }
        return md5(JSONUtil.encode(tmpArray));
    }

    public static getGuardianSpawnClass(param1: number): any {
        return CHAMPIONCAGE._guardians["G" + param1].spawnClass;
    }

    public static getGuardianClassType(param1: number): number {
        return CHAMPIONCAGE._guardians["G" + param1].classType;
    }

    public static CanTrainGuardian(param1: number): boolean {
        return CHAMPIONCAGE._guardians["G" + param1].props.powerLevel > 0 && CHAMPIONCAGE._guardians["G" + param1].classType == CHAMPIONCAGE.CLASS_TYPE_BASIC;
    }

    public static GetAllGuardianData(): any {
        let _loc2_: number = 0;
        let _loc3_: number = 0;
        let _loc4_: any[];
        let _loc5_: number = 0;
        const _loc1_: any = {};
        if (getBASE()._guardianData.length) {
            _loc3_ = 0;
            while (_loc3_ < getBASE()._guardianData.length) {
                _loc2_ = getBASE()._guardianData[_loc3_].status ? Number(getBASE()._guardianData[_loc3_].status) : ChampionBase.k_CHAMPION_STATUS_NORMAL;
                if (_loc2_ == ChampionBase.k_CHAMPION_STATUS_NORMAL && CHAMPIONCAGE.isBasicGuardian("G" + getBASE()._guardianData[_loc3_].t)) {
                    _loc1_[getBASE()._guardianData[_loc3_].t] = getBASE()._guardianData[_loc3_];
                }
                _loc3_++;
            }
        }
        if (getGLOBAL()._bChamber && (getGLOBAL()._bChamber as CHAMPIONCHAMBER)._frozen) {
            _loc4_ = (getGLOBAL()._bChamber as CHAMPIONCHAMBER)._frozen;
            _loc5_ = 0;
            while (_loc5_ < _loc4_.length) {
                _loc1_[_loc4_[_loc5_].t] = _loc4_[_loc5_];
                _loc5_++;
            }
        }
        return _loc1_;
    }

    public static GetGuardianData(param1: number): any {
        let _loc3_: any[];
        let _loc2_: number = 0;
        while (_loc2_ < getBASE()._guardianData.length) {
            if (getBASE()._guardianData[_loc2_] && getBASE()._guardianData[_loc2_].t == param1) {
                return getBASE()._guardianData[_loc2_];
            }
            _loc2_++;
        }
        if (getGLOBAL()._bChamber && (getGLOBAL()._bChamber as CHAMPIONCHAMBER)._frozen) {
            _loc3_ = (getGLOBAL()._bChamber as CHAMPIONCHAMBER)._frozen;
            _loc2_ = 0;
            while (_loc2_ < _loc3_.length) {
                if (_loc3_[_loc2_].t == param1) {
                    return _loc3_[_loc2_];
                }
                _loc2_++;
            }
        }
        return null;
    }

    public static isBasicGuardian(param1: string): boolean {
        return CHAMPIONCAGE._guardians[param1].classType == CHAMPIONCAGE.CLASS_TYPE_BASIC;
    }

    public static ShowKrallenTab(): void {
        if (!getGLOBAL()._bCage) {
            getGLOBAL().Message(getKEYS().Get("krallen_nogcage"));
            return;
        }
        if (!CHAMPIONCAGE._open) {
            CHAMPIONCAGE._open = true;
            getGLOBAL().BlockerAdd();
            CHAMPIONCAGE._popup = getGLOBAL()._layerWindows.addChild(new CHAMPIONCAGEPOPUP()) as CHAMPIONCAGEPOPUP;
            CHAMPIONCAGE._popup.Center();
            CHAMPIONCAGE._popup.ScaleUp();
            CHAMPIONCAGE._popup.Setup(2);
            if (getCREATURES()._guardian == null) {
                CHAMPIONCAGE._popup.b1.visible = false;
                CHAMPIONCAGE._popup.b1.mouseEnabled = false;
                CHAMPIONCAGE._popup.b2.visible = false;
                CHAMPIONCAGE._popup.b2.visible = false;
            }
        }
    }

    private setFeedProps(): void {
        if (!getMapRoomManager().instance.isInMapRoom3) {
            CHAMPIONCAGE._guardians.G1.props.feeds = [{"C2": 15}, {"C2": 10, "C6": 5}, {"C6": 20}, {"C6": 10, "C10": 10}, {"C10": 20}];
            CHAMPIONCAGE._guardians.G1.props.bonusFeeds = [{"C10": 20}, {"C10": 20}, {"C10": 20}];
            CHAMPIONCAGE._guardians.G2.props.feeds = [{"C1": 30}, {"C1": 20, "C4": 15}, {"C7": 50}, {"C7": 10, "C8": 15}, {"C8": 30}];
            CHAMPIONCAGE._guardians.G2.props.bonusFeeds = [{"C8": 30}, {"C8": 30}, {"C8": 30}];
            CHAMPIONCAGE._guardians.G3.props.feeds = [{"C3": 20}, {"C3": 20, "C9": 2}, {"C3": 40, "C9": 5}, {"C3": 30, "C9": 10}, {"C9": 20}];
            CHAMPIONCAGE._guardians.G3.props.bonusFeeds = [{"C9": 20}, {"C9": 20}, {"C9": 20}];
            CHAMPIONCAGE._guardians.G4.props.feeds = [{"IC1": 20, "IC2": 10}, {"IC2": 10, "IC7": 2}, {"IC7": 6}, {"IC7": 10}, {"IC8": 3}];
            CHAMPIONCAGE._guardians.G4.props.bonusFeeds = [{"IC8": 3}, {"IC8": 3}, {"IC8": 3}];
        }
    }

    public override StopMoveB(): void {
        super.StopMoveB();
        let _loc1_: number = 0;
        while (_loc1_ < getCREATURES()._guardianList.length) {
            if (getCREATURES()._guardianList[_loc1_]) {
                getCREATURES()._guardianList[_loc1_]._targetCenter = getGRID().FromISO(this._mc.x, this._mc.y);
                getCREATURES()._guardianList[_loc1_].changeModeCage();
            }
            _loc1_++;
        }
    }

    public override Setup(param1: any): void {
        super.Setup(param1);
        const _loc2_: any[] = getBASE()._guardianData;
        let _loc3_: number = 0;
        while (_loc3_ < getBASE()._guardianData.length) {
            if (_loc2_[_loc3_] && _loc2_[_loc3_].t && _loc2_[_loc3_].status == ChampionBase.k_CHAMPION_STATUS_NORMAL) {
                this.SpawnGuardian(getBASE()._guardianData[_loc3_].l.Get(), getBASE()._guardianData[_loc3_].fd, getBASE()._guardianData[_loc3_].ft, getBASE()._guardianData[_loc3_].t, getBASE()._guardianData[_loc3_].hp.Get(), getBASE()._guardianData[_loc3_].nm, getBASE()._guardianData[_loc3_].fb.Get(), getBASE()._guardianData[_loc3_].pl.Get());
                if (getCREATURES()._guardian && CHAMPIONCAGE.isBasicGuardian("G" + getCREATURES()._guardian._type) && getBASE()._guardianData[_loc3_].l.Get() == 6) {
                    ACHIEVEMENTS.Check("upgrade_champ" + getCREATURES()._guardian._type, 1);
                }
            }
            _loc3_++;
        }
    }

    public override Tick(param1: number): void {
        super.Tick(param1);
        if (!getGLOBAL()._catchup) {
            if (getGLOBAL().mode == getGLOBAL().e_BASE_MODE.BUILD && (getWMATTACK()._inProgress || MONSTERBAITER._attacking) || getGLOBAL().mode != getGLOBAL().e_BASE_MODE.BUILD) {
                this.Render("open");
            } else {
                this.Render("");
            }
        }
        if (CHAMPIONCAGE._open && CHAMPIONCAGE._popup) {
            CHAMPIONCAGE._popup.Tick();
        }
    }

    public SpawnGuardian(param1: number, param2: number, param3: number = 0, param4: number = 1, param5: number = 1000000000, param6: string = "", param7: number = 0, param8: number = 0): void {
        let _loc11_: any;
        let _loc12_: ChampionBase;
        let _loc13_: boolean = false;
        const _loc9_: Point = getGRID().FromISO(this.x - 20 + Math.random() * 40, this.y - 20 + Math.random() * 40);
        const _loc10_: any = CHAMPIONCAGE.getGuardianSpawnClass(param4);
        if (param3 == 0) {
            param3 = getGLOBAL().Timestamp() + CHAMPIONCAGE.GetGuardianProperty("G" + param4, param1, "feedTime");
        }
        if (!getCREATURES().getGuardian(param4) && this.canSpawnGuardian(param4)) {
            if (CHAMPIONCAGE._guardians["G" + param4].classType == CHAMPIONCAGE.CLASS_TYPE_BASIC) {
                getCREATURES()._guardian = new _loc10_("pen", CHAMPIONCAGE.PointInCage(_loc9_), 0, _loc9_, true, this, param1, param2, param3, param4, param5, param7, param8);
                for (_loc11_ of getBASE()._guardianData) {
                    if (_loc11_.t == param4 && _loc11_.status != ChampionBase.k_CHAMPION_STATUS_NORMAL) {
                        _loc11_.status = ChampionBase.k_CHAMPION_STATUS_NORMAL;
                        _loc11_.log = _loc11_.log != undefined ? _loc11_.log + "," + ChampionBase.k_CHAMPION_STATUS_NORMAL.toString() : ChampionBase.k_CHAMPION_STATUS_NORMAL.toString();
                        break;
                    }
                }
                if (getGLOBAL().mode == "build") {
                    for (_loc11_ of getGLOBAL()._playerGuardianData) {
                        if (_loc11_.t == param4 && _loc11_.status != ChampionBase.k_CHAMPION_STATUS_NORMAL) {
                            _loc11_.status = ChampionBase.k_CHAMPION_STATUS_NORMAL;
                            _loc11_.log = _loc11_.log != undefined ? _loc11_.log + "," + ChampionBase.k_CHAMPION_STATUS_NORMAL.toString() : ChampionBase.k_CHAMPION_STATUS_NORMAL.toString();
                            break;
                        }
                    }
                }
                getCREATURES()._guardian.export();
                if (param6 != "") {
                    getCREATURES()._guardian._name = param6;
                }
                if (!BYMConfig.instance.RENDERER_ON) {
                    getMAP()._BUILDINGTOPS.addChild(getCREATURES()._guardian.graphic);
                }
            } else {
                _loc12_ = new _loc10_("pen", CHAMPIONCAGE.PointInCage(_loc9_), 0, _loc9_, true, this, param1, param2, param3, param4, param5, param7, param8);
                _loc13_ = getCREATURES().addGuardian(_loc12_);
                if (_loc13_) {
                    _loc12_.export();
                    if (param6 != "") {
                        _loc12_._name = param6;
                    }
                    if (!BYMConfig.instance.RENDERER_ON) {
                        getMAP()._BUILDINGTOPS.addChild(_loc12_.graphic);
                    }
                }
            }
        }
        getQUESTS().Check("hatch_champ" + param4, 1);
    }

    public canSpawnGuardian(param1: number): boolean {
        const _loc2_: number = Number(getBASE()._guardianData.length);
        let _loc3_: number = 0;
        while (_loc3_ < _loc2_) {
            if (getBASE()._guardianData[_loc3_].t == param1) {
                return getBASE()._guardianData[_loc3_].status == ChampionBase.k_CHAMPION_STATUS_NORMAL;
            }
            _loc3_++;
        }
        return true;
    }

    public FeedGuardian(param1: string, param2: number, param3: boolean, param4: boolean = false): void {
        let _loc7_: number = 0;
        let _loc8_: number = 0;
        let _loc10_: string = "";
        let _loc11_: MonsterBase;
        let _loc12_: any[];
        let _loc13_: BFOUNDATION;
        let _loc14_: string = "";
        let _loc15_: number = 0;
        let _loc16_: number = 0;
        if (CHAMPIONCAGE._guardians[param1] == null) {
            return;
        }
        let _loc5_: any = CHAMPIONCAGE.GetGuardianProperty(param1, param2, "feeds");
        const _loc6_: any = {};
        if (param2 == 6) {
            _loc5_ = CHAMPIONCAGE._guardians[param1].props.bonusFeeds[getCREATURES()._guardian._foodBonus.Get()];
            if (getCREATURES()._guardian._foodBonus.Get() == 3) {
                _loc5_ = CHAMPIONCAGE.GetGuardianProperty(getCREATURES()._guardian._creatureID, 3, "bonusFeeds");
            }
        }
        let _loc9_: boolean = true;
        if (param2 == 6) {
            if (param3) {
                _loc16_ = CHAMPIONCAGE.GetGuardianProperty(param1, getCREATURES()._guardian._foodBonus.Get() + 1, "bonusFeedShiny");
                if (param4) {
                    _loc16_ *= 2;
                }
                if (getBASE()._credits.Get() < _loc16_) {
                    getPOPUPS().DisplayGetShiny();
                    return;
                }
                getBASE().Purchase("IFD", _loc16_, "cage");
                getCREATURES()._guardian._foodBonus.Add(1);
                if (getCREATURES()._guardian._foodBonus.Get() > 3) {
                    getCREATURES()._guardian._foodBonus.Set(3);
                }
                _loc7_ = getCREATURES()._guardian.health;
                if (getCREATURES()._guardian._foodBonus.Get() > 0 && getCREATURES()._guardian._foodBonus.Get() <= 3) {
                    _loc7_ += CHAMPIONCAGE.GetGuardianProperty(getCREATURES()._guardian._creatureID, getCREATURES()._guardian._foodBonus.Get(), "bonusHealth");
                }
                _loc8_ = CHAMPIONCAGE.GetGuardianProperty(getCREATURES()._guardian._creatureID, getCREATURES()._guardian._level.Get(), "health") + CHAMPIONCAGE.GetGuardianProperty(getCREATURES()._guardian._creatureID, getCREATURES()._guardian._foodBonus.Get(), "bonusHealth");
                if (_loc7_ >= _loc8_) {
                    _loc7_ = _loc8_;
                }
                getCREATURES()._guardian.setHealth(_loc7_);
                getGLOBAL().Message(getKEYS().Get("msg_champion_fed", {"v1": getGLOBAL().ToTime(CHAMPIONCAGE.GetGuardianProperty(param1, getCREATURES()._guardian._level.Get(), "feedTime"))}));
                getCREATURES()._guardian._feedTime = new SecNum(getGLOBAL().Timestamp() + CHAMPIONCAGE.GetGuardianProperty(param1, getCREATURES()._guardian._level.Get(), "feedTime"));
                getCREATURES()._guardian.export();
                getLOGGER().Log("fed", "Buff Fed shiny " + getCREATURES()._guardian._foodBonus.Get());
                getLOGGER().Stat([60, getCREATURES()._guardian._creatureID, CHAMPIONCAGE.GetGuardianProperty(param1, getCREATURES()._guardian._foodBonus.Get(), "bonusFeedShiny"), getCREATURES()._guardian._foodBonus.Get()]);
                getBASE().Save();
            } else if (_loc5_) {
                for (_loc10_ in _loc5_) {
                    if (getGLOBAL().player.monsterListByID(_loc10_) == null || getGLOBAL().player.monsterListByID(_loc10_) && getGLOBAL().player.monsterListByID(_loc10_).numHealthyHousedCreeps < _loc5_[_loc10_]) {
                        _loc9_ = false;
                        break;
                    }
                    _loc6_[_loc10_] = _loc5_[_loc10_];
                }
                if (_loc9_) {
                    _loc12_ = getInstanceManager().getInstancesByClass(getBASE().isInfernoMainYardOrOutpost ? HOUSINGBUNKER : BUILDING15);
                    for (_loc14_ in _loc6_) {
                        getGLOBAL().player.monsterListByID(_loc14_).add(-_loc6_[_loc14_]);
                        for (_loc11_ of Object.values(getCREATURES()._creatures)) {
                            if (_loc6_[_loc14_] > 0) {
                                if (_loc11_._creatureID == _loc14_ && _loc11_._behaviour != "feed" && _loc11_._behaviour != "juice") {
                                    _loc11_.changeModeFeed();
                                    --_loc6_[_loc14_];
                                }
                            }
                        }
                        _loc15_ = 0;
                        while (_loc15_ < _loc6_[_loc14_]) {
                            _loc13_ = _loc12_[Math.floor(Math.random() * _loc12_.length)] as BFOUNDATION;
                            getCREATURES().Spawn(_loc14_, getMAP()._BUILDINGTOPS, "feed", new Point(_loc13_.x, _loc13_.y).add(new Point(-60 + Math.random() * 135, 65 + Math.random() * 50)), Math.random() * 360);
                            _loc15_++;
                        }
                    }
                    getHOUSING().HousingSpace();
                    getCREATURES()._guardian._foodBonus.Add(1);
                    if (getCREATURES()._guardian._foodBonus.Get() > 3) {
                        getCREATURES()._guardian._foodBonus.Set(3);
                    }
                    _loc7_ = getCREATURES()._guardian.health;
                    if (getCREATURES()._guardian._foodBonus.Get() > 0 && getCREATURES()._guardian._foodBonus.Get() <= 3) {
                        _loc7_ += CHAMPIONCAGE.GetGuardianProperty(getCREATURES()._guardian._creatureID, getCREATURES()._guardian._foodBonus.Get(), "bonusHealth");
                    }
                    _loc8_ = CHAMPIONCAGE.GetGuardianProperty(getCREATURES()._guardian._creatureID, getCREATURES()._guardian._level.Get(), "health") + CHAMPIONCAGE.GetGuardianProperty(getCREATURES()._guardian._creatureID, getCREATURES()._guardian._foodBonus.Get(), "bonusHealth");
                    if (_loc7_ >= _loc8_) {
                        _loc7_ = _loc8_;
                    }
                    getCREATURES()._guardian.setHealth(_loc7_);
                    getGLOBAL().Message(getKEYS().Get("msg_champion_feeding", {"v1": getGLOBAL().ToTime(CHAMPIONCAGE.GetGuardianProperty(param1, getCREATURES()._guardian._level.Get(), "feedTime"))}));
                    getCREATURES()._guardian._feedTime = new SecNum(getGLOBAL().Timestamp() + CHAMPIONCAGE.GetGuardianProperty(param1, getCREATURES()._guardian._level.Get(), "feedTime"));
                    getCREATURES()._guardian.export();
                    getLOGGER().Log("fed", "Buff Fed creeps " + getCREATURES()._guardian._foodBonus.Get());
                    getLOGGER().Stat([60, getCREATURES()._guardian._creatureID, 0, getCREATURES()._guardian._foodBonus.Get()]);
                    getBASE().Save();
                } else {
                    getGLOBAL().Message(getKEYS().Get("msg_champion_morecreatures"));
                }
            }
        } else if (param3) {
            if (getBASE()._credits.Get() < CHAMPIONCAGE.GetGuardianProperty(param1, param2, "feedShiny")) {
                getPOPUPS().DisplayGetShiny();
                return;
            }
            getBASE().Purchase("IFD", CHAMPIONCAGE.GetGuardianProperty(param1, param2, "feedShiny"), "cage");
            getCREATURES()._guardian._feeds.Add(1);
            if (getCREATURES()._guardian._feeds.Get() >= CHAMPIONCAGE.GetGuardianProperty(param1, param2, "feedCount")) {
                if (param2 < 5) {
                    getGLOBAL().Message(getKEYS().Get("msg_champion_evolved", {
                        "v1": param2 + 1,
                        "v2": getGLOBAL().ToTime(CHAMPIONCAGE.GetGuardianProperty(param1, getCREATURES()._guardian._level.Get(), "feedTime"))
                    }));
                } else {
                    getGLOBAL().Message(getKEYS().Get("msg_champion_fullyevolved", {"v1": param2 + 1}));
                }
                getCREATURES()._guardian.levelSet(param2 + 1);
                if (getCREATURES()._guardian._level.Get() == 6) {
                    ACHIEVEMENTS.Check("upgrade_champ" + getCREATURES()._guardian._type, 1);
                }
            } else {
                getGLOBAL().Message(getKEYS().Get("msg_champion_fed", {"v1": getGLOBAL().ToTime(CHAMPIONCAGE.GetGuardianProperty(param1, getCREATURES()._guardian._level.Get(), "feedTime"))}));
            }
            getCREATURES()._guardian._feedTime = new SecNum(getGLOBAL().Timestamp() + CHAMPIONCAGE.GetGuardianProperty(param1, getCREATURES()._guardian._level.Get(), "feedTime"));
            getCREATURES()._guardian.export();
            getLOGGER().Log("fed", "Fed shiny " + getCREATURES()._guardian._feeds.Get());
            getLOGGER().Stat([58, getCREATURES()._guardian._creatureID, CHAMPIONCAGE.GetGuardianProperty(param1, param2, "feedShiny"), getCREATURES()._guardian._level.Get()]);
            getBASE().Save();
        } else if (_loc5_) {
            _loc9_ = true;
            for (_loc10_ in _loc5_) {
                if (getGLOBAL().player.monsterListByID(_loc10_) == null || getGLOBAL().player.monsterListByID(_loc10_) && getGLOBAL().player.monsterListByID(_loc10_).numHealthyHousedCreeps < _loc5_[_loc10_]) {
                    _loc9_ = false;
                    break;
                }
                _loc6_[_loc10_] = _loc5_[_loc10_];
            }
            if (_loc9_) {
                _loc12_ = getInstanceManager().getInstancesByClass(getBASE().isInfernoMainYardOrOutpost ? HOUSINGBUNKER : BUILDING15);
                for (_loc14_ in _loc6_) {
                    getGLOBAL().player.monsterListByID(_loc14_).add(-_loc6_[_loc14_]);
                    for (_loc11_ of Object.values(getCREATURES()._creatures)) {
                        if (_loc6_[_loc14_] > 0) {
                            if (_loc11_._creatureID == _loc14_ && _loc11_._behaviour != "feed" && _loc11_._behaviour != "juice") {
                                _loc11_.changeModeFeed();
                                --_loc6_[_loc14_];
                            }
                        }
                    }
                    _loc15_ = 0;
                    while (_loc15_ < _loc6_[_loc14_]) {
                        _loc13_ = _loc12_[Math.floor(Math.random() * _loc12_.length)] as BFOUNDATION;
                        getCREATURES().Spawn(_loc14_, getMAP()._BUILDINGTOPS, "feed", new Point(_loc13_.x, _loc13_.y).add(new Point(-60 + Math.random() * 135, 65 + Math.random() * 50)), Math.random() * 360);
                        _loc15_++;
                    }
                }
                getHOUSING().HousingSpace();
                getCREATURES()._guardian._feeds.Add(1);
                if (getCREATURES()._guardian._feeds.Get() >= CHAMPIONCAGE.GetGuardianProperty(param1, param2, "feedCount")) {
                    getCREATURES()._guardian.levelSet(param2 + 1);
                    if (getCREATURES()._guardian._level.Get() == 6) {
                        ACHIEVEMENTS.Check("upgrade_champ" + getCREATURES()._guardian._type, 1);
                    }
                    if (param2 < 5) {
                        getGLOBAL().Message(getKEYS().Get("msg_champion_evolved", {
                            "v1": param2 + 1,
                            "v2": getGLOBAL().ToTime(CHAMPIONCAGE.GetGuardianProperty(param1, getCREATURES()._guardian._level.Get(), "feedTime"))
                        }));
                    } else {
                        getGLOBAL().Message(getKEYS().Get("msg_champion_fullyevolved", {"v1": param2 + 1}));
                    }
                } else {
                    getGLOBAL().Message(getKEYS().Get("msg_champion_feeding", {"v1": getGLOBAL().ToTime(CHAMPIONCAGE.GetGuardianProperty(param1, getCREATURES()._guardian._level.Get(), "feedTime"))}));
                }
                getCREATURES()._guardian._feedTime = new SecNum(getGLOBAL().Timestamp() + CHAMPIONCAGE.GetGuardianProperty(param1, getCREATURES()._guardian._level.Get(), "feedTime"));
                getCREATURES()._guardian.export();
                getLOGGER().Log("fed", "Fed creeps " + getCREATURES()._guardian._feeds.Get());
                getLOGGER().Stat([58, getCREATURES()._guardian._creatureID, 0, getCREATURES()._guardian._level.Get()]);
                getBASE().Save();
            } else {
                getGLOBAL().Message(getKEYS().Get("msg_champion_morecreatures"));
            }
        }
    }

    public override PlaceB(): void {
        super.PlaceB();
        getGLOBAL()._bCage = this;
    }

    public override Description(): void {
        super.Description();
    }

    public override Constructed(): void {
        super.Constructed();
        getGLOBAL()._bCage = this;
    }

    public override Upgraded(): void {
        super.Upgraded();
    }

    public override Recycle(): void {
        if (getCREATURES()._guardianList.length) {
            getGLOBAL().Message(getKEYS().Get("msg_cage_recycle"));
        } else {
            getGLOBAL()._bCage = null;
            super.Recycle();
        }
    }

    public override Export(): any {
        return super.Export();
    }

    public override modifyHealth(param1: number, param2: ITargetable | null = null): number {
        return 0;
    }

    public RemoveGuardian(param1: number, param2: number = 3): void {
        getCREATURES().removeGuardianType(param1);
        let _loc3_: number = 0;
        _loc3_ = getGLOBAL().getPlayerGuardianIndex(param1);
        if (_loc3_ >= 0) {
            getGLOBAL()._playerGuardianData[_loc3_].status = param2;
            getGLOBAL()._playerGuardianData[_loc3_].log += "," + param2.toString();
        }
        _loc3_ = getBASE().getGuardianIndex(param1);
        if (_loc3_ >= 0) {
            getBASE()._guardianData[_loc3_].status = param2;
            getBASE()._guardianData[_loc3_].log += "," + param2.toString();
        }
    }
}
