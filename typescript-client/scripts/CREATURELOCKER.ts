import { MovieClip } from 'openfl/display/MovieClip';
import { MouseEvent } from 'openfl/events/MouseEvent';
import { CreepTypeManager } from './com/monsters/creep_types/CreepTypeManager';
import { MapRoomManager } from './com/monsters/maproom_manager/MapRoomManager';
import { Bandito } from './com/monsters/monsters/creeps/Bandito';
import { Bolt } from './com/monsters/monsters/creeps/Bolt';
import { Brain } from './com/monsters/monsters/creeps/Brain';
import { DAVE } from './com/monsters/monsters/creeps/DAVE';
import { Eyera } from './com/monsters/monsters/creeps/Eyera';
import { Fang } from './com/monsters/monsters/creeps/Fang';
import { Fink } from './com/monsters/monsters/creeps/Fink';
import { ProjectX } from './com/monsters/monsters/creeps/ProjectX';
import { Rezghul } from './com/monsters/monsters/creeps/Rezghul';
import { Slimeattikus } from './com/monsters/monsters/creeps/Slimeattikus';
import { Teratorn } from './com/monsters/monsters/creeps/Teratorn';
import { Vorg } from './com/monsters/monsters/creeps/Vorg';
import { Wormzer } from './com/monsters/monsters/creeps/Wormzer';
import { Zafreeti } from './com/monsters/monsters/creeps/Zafreeti';
import { Balthazar } from './com/monsters/monsters/creeps/inferno/Balthazar';
import { KingWormzer } from './com/monsters/monsters/creeps/inferno/KingWormzer';
import { Sabnox } from './com/monsters/monsters/creeps/inferno/Sabnox';
import { Spurtz } from './com/monsters/monsters/creeps/inferno/Spurtz';
import { RebalancedCreatures } from './com/monsters/monsters/creeps/rebalance/RebalancedCreatures';
import { SubscriptionHandler } from './com/monsters/subscriptions/SubscriptionHandler';
import { CREATURELOCKERPOPUP } from './CREATURELOCKERPOPUP';
import { GLOBAL } from './GLOBAL';
import { BASE } from './BASE';
import { KEYS } from './KEYS';
import { ACHIEVEMENTS } from './ACHIEVEMENTS';
import { QUESTS } from './QUESTS';
import { SOUNDS } from './SOUNDS';
import { STORE } from './STORE';
import { POPUPS } from './POPUPS';
import { LOGGER } from './LOGGER';
import { HATCHERYCC } from './HATCHERYCC';
import { MAPROOM_DESCENT } from './MAPROOM_DESCENT';
import { popup_monster } from './popup_monster';
import { md5 } from './md5';
import { JSON } from './JSON';

export class CREATURELOCKER {
    public static readonly k_USE_REBALANCED_MONSTERS: boolean = false;
    public static _lockerData: any;
    public static _open: boolean;
    public static _mc: CREATURELOCKERPOPUP;
    public static _mainCreatures: any;
    public static _page: number;
    public static _unlocking: string;
    public static _popupCreatureID: string;
    public static readonly NUM_CREEP_TYPE: number = 18;
    public static readonly NUM_ICREEP_TYPE: number = 8;

    constructor() {}

    public static get _creatures(): any {
        return CREATURELOCKER._mainCreatures;
    }

    public static getFirstCreatureID(): string {
        return BASE.isInfernoMainYardOrOutpost ? "IC1" : "C1";
    }

    public static Data(param1: any): void {
        let _loc2_: number = 0;
        CREATURELOCKER._lockerData = param1;
        CREATURELOCKER._lockerData[CREATURELOCKER.getFirstCreatureID()] = { "t": 2 };
        if (CREATURELOCKER._lockerData.C100) {
            CREATURELOCKER._lockerData.C12 = CREATURELOCKER._lockerData.C100;
            delete CREATURELOCKER._lockerData.C100;
        }
        if (GLOBAL.mode == GLOBAL.e_BASE_MODE.BUILD) {
            if (BASE.isInfernoMainYardOrOutpost) {
                for (_loc2_ = 2; _loc2_ <= CREATURELOCKER.NUM_ICREEP_TYPE; _loc2_++) {
                    if (CREATURELOCKER._lockerData["IC" + _loc2_] && CREATURELOCKER._lockerData["IC" + _loc2_].t == 2) {
                        ACHIEVEMENTS.Check("unlock_monster", 1);
                        break;
                    }
                }
            } else {
                for (_loc2_ = 2; _loc2_ <= CREATURELOCKER.NUM_CREEP_TYPE; _loc2_++) {
                    if (CREATURELOCKER._lockerData["C" + _loc2_] && CREATURELOCKER._lockerData["C" + _loc2_].t == 2) {
                        ACHIEVEMENTS.Check("unlock_monster", 1);
                        break;
                    }
                }
            }
        }
    }

    public static Setup(): void {
        let _loc1_: string = null;
        CREATURELOCKER._page = 1;
        CREATURELOCKER._popupCreatureID = CREATURELOCKER.getFirstCreatureID();
        CREATURELOCKER._lockerData = {};
        CREATURELOCKER._open = false;
        CREATURELOCKER._mainCreatures = {
            "C1": {
                "index": 1, "page": 1, "order": 1, "resource": 4000, "time": 10 * 60, "level": 1,
                "name": "#m_pokey#", "description": "mon_pokeydesc",
                "stream": ["mon_pokeystream", "mon_pokeystreambody", "quests/monster1.v2.png"],
                "unlock": [""],
                "trainingCosts": [[4000, 60 * 60 * 2], [8000, 60 * 60 * 3], [12000, 60 * 60 * 5], [16000, 60 * 60 * 8], [22000, 60 * 60 * 12]],
                "props": {
                    "speed": [1.2], "health": [200, 220, 240, 260, 280, 300], "damage": [60, 65, 70, 75, 80, 85],
                    "cTime": [15, 10, 8, 7, 6, 5], "cResource": [250, 450, 675, 800, 1000, 1250],
                    "cStorage": [10, 10, 10, 9, 8, 7], "bucket": [7], "targetGroup": [1],
                    "hTime": [5, 3, 2, 2, 2, 2], "hResource": [75, 135, 203, 240, 300, 375]
                }
            },
            "C2": {
                "index": 2, "page": 1, "order": 2, "resource": 8000, "time": 1 * 60 * 60, "level": 1,
                "name": "#m_octoooze#", "description": "mon_octooozedesc",
                "stream": ["mon_octooozestream", "mon_octooozestreambody", "quests/monster2.v2.png"],
                "trainingCosts": [[8000, 60 * 60 * 4], [16000, 60 * 60 * 6], [24000, 60 * 60 * 10], [48000, 60 * 60 * 16], [64000, 60 * 60 * 24]],
                "props": {
                    "speed": [1.4], "health": [1000, 1100, 1300, 1450, 1600, 1800], "damage": [15, 15, 20, 25, 30, 35],
                    "cTime": [15, 16], "cResource": [500, 900, 1350, 1800, 2100, 2500], "cStorage": [10], "bucket": [10],
                    "targetGroup": [4], "hTime": [5], "hResource": [150, 270, 405, 540, 630, 750]
                }
            },
            "C3": {
                "index": 3, "page": 1, "order": 3, "resource": 16000, "time": 2 * 60 * 60, "level": 1,
                "name": "#m_bolt#", "classType": Bolt, "description": "mon_boltdesc",
                "stream": ["mon_boltstream", "mon_boltstreambody", "quests/monster3.v2.png"],
                "trainingCosts": [[16000, 60 * 60 * 4], [32000, 60 * 60 * 6], [48000, 60 * 60 * 8], [96000, 60 * 60 * 12], [144000, 60 * 60 * 16]],
                "props": {
                    "speed": [2.5, 2.55, 2.6, 2.8, 3, 3.2], "health": [150], "damage": [15, 20, 25, 35, 45, 55],
                    "cTime": [23], "cResource": [350, 675, 1015, 1400, 1800, 2400], "cStorage": [15], "bucket": [15],
                    "targetGroup": [3], "hTime": [7], "hResource": [105, 203, 305, 420, 540, 720]
                }
            },
            "C4": {
                "index": 4, "page": 1, "order": 4, "resource": 32000, "time": 4 * 60 * 60, "level": 1,
                "name": "#m_fink#", "classType": Fink, "description": "mon_finkdesc",
                "stream": ["mon_finkstream", "mon_finkstreambody", "quests/monster4.v2.png"],
                "trainingCosts": [[32000, 60 * 60 * 8], [64000, 60 * 60 * 12], [96000, 60 * 60 * 18], [128000, 60 * 60 * 24], [160000, 60 * 60 * 30]],
                "props": {
                    "speed": [1.3], "health": [200, 200, 200, 200, 220, 240], "damage": [300, 330, 380, 430, 470, 520],
                    "cTime": [100, 100, 100, 100, 90, 90], "cResource": [1500, 2250, 3375, 4800, 7200, 10000],
                    "cStorage": [20], "bucket": [20], "targetGroup": [1],
                    "hTime": [30, 30, 30, 30, 27, 27], "hResource": [450, 675, 1013, 1440, 2160, 3000]
                }
            },
            "C5": {
                "index": 5, "page": 2, "order": 1, "resource": 64000, "time": 8 * 60 * 60, "level": 2,
                "name": "#m_eyera#", "classType": Eyera, "description": "mon_eyeradesc",
                "stream": ["mon_eyerastream", "mon_eyerastreambody", "quests/monster5.v2.png"],
                "trainingCosts": [[64000, 60 * 60 * 5], [128000, 60 * 60 * 7], [192000, 60 * 60 * 12], [384000, 60 * 60 * 24], [512000, 60 * 60 * 36]],
                "props": {
                    "speed": [2, 2.2, 2.4, 2.6, 2.8, 3], "health": [600, 900, 1200, 1600, 2000, 2400],
                    "damage": [4000, 8000, 12000, 16000, 20000, 24000], "cTime": [1500],
                    "cResource": [5000, 15000, 30000, 45000, 60000, 80000], "cStorage": [60], "bucket": [60],
                    "targetGroup": [2], "explode": [1], "hTime": [450], "hResource": [1500, 4500, 9000, 13500, 18000, 24000]
                }
            },
            "C6": {
                "index": 6, "page": 2, "order": 2, "resource": 128000, "time": 16 * 60 * 60, "level": 2,
                "name": "#m_ichi#", "description": "mon_ichidesc",
                "stream": ["mon_ichistream", "mon_ichistreambody", "quests/monster6.v2.png"],
                "trainingCosts": [[128000, 60 * 60 * 12], [256000, 60 * 60 * 18], [409600, 60 * 60 * 24], [640000, 60 * 60 * 48], [820000, 60 * 60 * 72]],
                "props": {
                    "speed": [1.2], "health": [2000, 2100, 2200, 2300, 2500, 2800], "damage": [50, 60, 70, 80, 95, 110],
                    "cTime": [100, 100, 90], "cResource": [5000, 5625, 8440, 11200, 16000, 24000],
                    "cStorage": [20], "bucket": [20], "targetGroup": [4],
                    "hTime": [30, 30, 27], "hResource": [1500, 1688, 2532, 3360, 4800, 7200]
                }
            },
            "C7": {
                "index": 7, "page": 2, "order": 3, "resource": 256000, "time": 28 * 60 * 60, "level": 2,
                "name": "#m_bandito#", "classType": Bandito, "description": "mon_banditodesc",
                "stream": ["mon_banditostream", "mon_banditostreambody", "quests/monster7.v2.png"],
                "trainingCosts": [[256000, 60 * 60 * 12], [512000, 60 * 60 * 16], [756000, 60 * 60 * 24], [1024000, 60 * 60 * 36], [1440000, 60 * 60 * 48]],
                "props": {
                    "speed": [1], "health": [500, 550, 600, 650, 750, 900], "damage": [200, 250, 300, 350, 400, 450],
                    "cTime": [225, 225, 225, 225, 180, 180], "cResource": [2500, 4500, 6750, 8750, 11200, 14400],
                    "cStorage": [20], "bucket": [20], "targetGroup": [1],
                    "hTime": [68, 68, 68, 68, 54, 54], "hResource": [750, 1350, 2025, 2625, 3360, 4320]
                }
            },
            "C8": {
                "index": 8, "page": 2, "order": 4, "resource": 512000, "time": 40 * 60 * 60, "level": 2,
                "name": "#m_fang#", "classType": Fang, "description": "mon_fangdesc",
                "stream": ["mon_fangstream", "mon_fangstreambody", "quests/monster8.v2.png"],
                "trainingCosts": [[512000, 60 * 60 * 12], [512000, 60 * 60 * 16], [756000, 60 * 60 * 24], [1024000, 60 * 60 * 36], [1440000, 60 * 60 * 48]],
                "props": {
                    "speed": [1.1, 1.2, 1.3, 1.4, 1.5, 1.6], "health": [400], "damage": [600, 600, 620, 660, 720, 800],
                    "cTime": [450, 350, 250, 225, 195, 195], "cResource": [18000, 27000, 40500, 60500, 80000, 100000],
                    "cStorage": [30], "bucket": [30], "targetGroup": [1],
                    "hTime": [135, 105, 75, 68, 59, 59], "hResource": [5400, 8100, 12150, 18150, 24000, 30000]
                }
            },
            "C9": {
                "index": 10, "page": 3, "order": 1, "resource": 1024000, "time": 52 * 60 * 60, "level": 3,
                "name": "#m_brain#", "classType": Brain, "description": "mon_braindesc",
                "stream": ["mon_brainstream", "mon_brainstreambody", "quests/monster9.v2.png"],
                "trainingCosts": [[1024000, 60 * 60 * 12], [2056000, 60 * 60 * 16], [2870000, 60 * 60 * 20], [4500000, 60 * 60 * 40], [6000000, 60 * 60 * 60]],
                "props": {
                    "speed": [2, 2, 2, 2, 2.1, 2.2], "health": [600, 700, 750, 800, 1100, 1400],
                    "damage": [100, 100, 200, 250, 300, 350], "cTime": [342],
                    "cResource": [12000, 20250, 30375, 35000, 50000, 75000], "cStorage": [30], "bucket": [30],
                    "targetGroup": [3], "hTime": [103], "hResource": [3600, 6075, 9113, 10500, 1500, 22500]
                }
            },
            "C10": {
                "index": 11, "page": 3, "order": 3, "resource": 2048000, "time": 58 * 60 * 60, "level": 3,
                "name": "#m_crabatron#", "description": "mon_crabatrondesc",
                "stream": ["mon_crabatronstream", "mon_crabatronstreambody", "quests/monster10.v2.png"],
                "trainingCosts": [[2048000, 60 * 60 * 12], [3000000, 60 * 60 * 18], [4400000, 60 * 60 * 24], [6000000, 60 * 60 * 48], [7500000, 60 * 60 * 72]],
                "props": {
                    "speed": [1, 1, 1, 1.2, 1.4, 1.5], "health": [4000, 4000, 4300, 4400, 4600, 4800],
                    "damage": [100, 120, 130, 140, 150, 170], "cTime": [750],
                    "cResource": [30000, 45000, 67500, 75000, 90000, 120000], "cStorage": [40], "bucket": [40],
                    "targetGroup": [4], "hTime": [225], "hResource": [9000, 13500, 20250, 22500, 27000, 36000]
                }
            },
            "C11": {
                "index": 12, "page": 3, "order": 4, "resource": 4096000, "time": 62 * 60 * 60, "level": 3,
                "name": "#m_projectx#", "classType": ProjectX, "description": "mon_projectxdesc",
                "stream": ["mon_projectxstream", "mon_projectxstreambody", "quests/monster11.v2.png"],
                "trainingCosts": [[4096000, 60 * 60 * 24], [7000000, 60 * 60 * 36], [12000000, 60 * 60 * 48], [18000000, 60 * 60 * 96], [24000000, 60 * 60 * 128]],
                "props": {
                    "speed": [0.9, 0.9, 1, 1.2, 1.2, 1.3], "health": [800, 900, 950, 1000, 1100, 1200],
                    "damage": [1200, 1400, 1600, 1800, 2000, 2200], "cTime": [1384],
                    "cResource": [60000, 90000, 135000, 180000, 234000, 280000], "cStorage": [70], "bucket": [70],
                    "targetGroup": [4], "hTime": [415], "hResource": [18000, 27000, 40500, 54000, 70200, 84000]
                }
            },
            "C12": {
                "index": 16, "page": 4, "order": 3, "resource": 8192000, "time": 72 * 60 * 60, "level": 4,
                "name": "#m_dave#", "classType": DAVE, "description": "mon_davedesc",
                "stream": ["mon_davestream", "mon_davestreambody", "quests/monster12.v2.png"],
                "trainingCosts": [[8192000, 60 * 60 * 48], [10000000, 60 * 60 * 72], [12200000, 60 * 60 * 96], [19200000, 60 * 60 * 144], [28000000, 60 * 60 * 192]],
                "props": {
                    "speed": [0.8, 0.85, 0.9, 1, 1.1, 1.2], "health": [8000, 9100, 10000, 12000, 16500, 21000],
                    "damage": [1500, 1500, 1600, 1700, 1800, 1900], "cTime": [3600],
                    "cResource": [150000, 225000, 337500, 440000, 600000, 800000], "cStorage": [160], "bucket": [160],
                    "targetGroup": [1], "hTime": [1080], "hResource": [45000, 67500, 101250, 132000, 180000, 240000]
                }
            },
            "C13": {
                "index": 15, "page": 4, "order": 2, "resource": 4096000, "time": 62 * 60 * 60, "level": 4,
                "name": "#m_wormzer#", "classType": Wormzer, "description": "mon_wormzerdesc",
                "stream": ["mon_wormzerstream", "mon_wormzerstreambody", "quests/monster13.v2.png"],
                "trainingCosts": [[4096000, 60 * 60 * 24], [8192000, 60 * 60 * 48], [8192000, 60 * 60 * 72], [8192000, 60 * 60 * 96], [12800000, 60 * 60 * 128]],
                "movement": "burrow", "pathing": "direct",
                "props": {
                    "speed": [3, 4], "health": [600, 800, 1100, 1300, 1500, 1700], "damage": [300, 400, 550, 600, 650, 700],
                    "cTime": [1384], "cResource": [20000, 25000, 30000, 35000, 40000, 47500],
                    "cStorage": [70], "bucket": [70], "targetGroup": [1],
                    "hTime": [415], "hResource": [6000, 7500, 9000, 10500, 12000, 14250]
                }
            },
            "C14": {
                "index": 14, "page": 4, "order": 1, "resource": 4096000, "time": 60 * 60 * 60, "level": 4,
                "name": "#m_teratorn#", "classType": Teratorn, "description": "mon_teratorndesc",
                "stream": ["mon_teratornstream", "mon_teratornstreambody", "quests/monster14.v3.png"],
                "trainingCosts": [[4096000, 60 * 60 * 36], [7000000, 60 * 60 * 54], [10000000, 60 * 60 * 80], [16000000, 60 * 60 * 136], [24000000, 60 * 60 * 180]],
                "movement": "fly", "pathing": "direct",
                "props": {
                    "range": [150], "attackDelay": [90], "speed": [2.5, 2.75, 3, 3.25, 3.5],
                    "health": [1600, 1900, 2400, 3000, 3600, 4200], "damage": [300, 350, 400, 500, 600, 700],
                    "cTime": [1800, 1920, 2040, 2160, 2280, 2400], "cResource": [70000, 95000, 145000, 200000, 300000, 400000],
                    "cStorage": [70], "bucket": [70], "targetGroup": [1],
                    "hTime": [540, 576, 612, 648, 684, 720], "hResource": [21000, 28500, 43500, 60000, 90000, 120000]
                }
            },
            "C15": {
                "index": 13, "page": 3, "order": 5, "resource": 6192000, "time": 60 * 60 * 60, "level": 3,
                "name": "#m_zafreeti#", "classType": Zafreeti, "description": "mon_zafreetidesc",
                "stream": ["mon_zafreetistream", "mon_zafreetistreambody", "quests/monster15.v2.png"],
                "trainingCosts": [[6192000, 60 * 60 * 36], [7800000, 60 * 60 * 54], [12000000, 60 * 60 * 80], [18000000, 60 * 60 * 136]],
                "movement": "fly", "pathing": "direct", "antiHeal": true,
                "props": {
                    "range": [150], "attackDelay": [20], "speed": [0.75, 0.8, 0.85, 0.9, 0.95], "health": [8000],
                    "damage": [-400, -550, -700, -850, -1000], "cTime": [2400],
                    "cResource": [120000, 180000, 256000, 324000, 468000], "cStorage": [200], "bucket": [200],
                    "targetGroup": [5], "hTime": [720], "hResource": [36000, 54000, 76800, 97200, 140400]
                }
            },
            "C16": {
                "index": 9, "page": 2, "order": 5, "resource": 384000, "time": 36 * 60 * 60, "level": 2,
                "name": "#m_vorg#", "blocked": true, "classType": Vorg, "description": "mon_vorgdesc",
                "trainingCosts": [[384000, 60 * 60 * 24], [384000, 60 * 60 * 36], [512000, 60 * 60 * 48], [768000, 60 * 60 * 60], [1024000, 60 * 60 * 72]],
                "movement": "fly", "stream": ["", "", "quests/monster16.png"], "pathing": "direct", "antiHeal": true,
                "props": {
                    "range": [150], "attackDelay": [10], "speed": [1.5, 1.75, 2, 2.25, 2.5], "health": [750],
                    "damage": [-60, -70, -80, -90, -100, -110], "cTime": [1200],
                    "cResource": [16000, 25000, 38500, 62500, 75000, 90000], "cStorage": [60], "bucket": [60],
                    "targetGroup": [5], "hTime": [360], "hResource": [4800, 7500, 11550, 18750, 22500, 27000]
                }
            },
            "C17": {
                "index": 10, "page": 3, "order": 2, "resource": 2048000, "time": 36 * 60 * 60, "level": 3,
                "name": "#m_slimeattikus#", "classType": Slimeattikus, "description": "mon_slimeattikusdesc",
                "trainingCosts": [[2560000, 60 * 60 * 24], [3840000, 60 * 60 * 36], [4096000, 60 * 60 * 48], [6250000, 60 * 60 * 60], [8500000, 60 * 60 * 80]],
                "stream": ["", "", "quests/monster17.png"], "blocked": true,
                "props": {
                    "speed": [1, 1.1, 1.2, 1.3, 1.4, 1.5], "health": [700, 725, 750, 800, 900, 1000],
                    "damage": [850, 850, 900, 1000, 1200, 1400], "cTime": [500, 450, 400, 350, 300, 250],
                    "cResource": [27000, 40500, 60750, 90000, 125000, 150000], "cStorage": [40], "bucket": [40],
                    "targetGroup": [1], "splits": [2, 2, 3, 3, 4, 5],
                    "hTime": [150, 135, 120, 105, 90, 75], "hResource": [8100, 12150, 18225, 27000, 37500, 45000]
                }
            },
            "C18": {
                "index": 0, "page": 0, "order": 0, "resource": 2048000, "time": 36 * 60 * 60, "level": 3,
                "name": "#m_slimeattikusmini#", "blocked": true, "description": "mon_slimeattikusminidesc",
                "trainingCosts": [[2560000, 60 * 60 * 24], [3840000, 60 * 60 * 36], [4096000, 60 * 60 * 48], [6250000, 60 * 60 * 60], [8500000, 60 * 60 * 80]],
                "stream": ["", "", ""], "fake": true, "dependent": "C17",
                "props": {
                    "speed": [1.5, 1.6, 1.7, 1.8, 1.9, 2], "health": [250], "damage": [310, 320, 330, 340, 350],
                    "cTime": [500, 450, 400, 350, 300, 250], "cResource": [27000, 40500, 60750, 90000, 125000, 150000],
                    "cStorage": [40], "bucket": [40], "targetGroup": [1]
                }
            },
            "C19": {
                "index": 17, "page": 0, "order": 0, "resource": 2048000, "time": 36 * 60 * 60, "level": 3,
                "name": "#m_rezghul#", "classType": Rezghul, "description": "mon_rezghuldesc",
                "trainingCosts": [[16000000, 60 * 60 * 24], [19000000, 60 * 60 * 36], [22000000, 60 * 60 * 48], [25000000, 60 * 60 * 60], [28000000, 60 * 60 * 72]],
                "stream": ["", "", "quests/monster19.png"], "blocked": true,
                "props": {
                    "range": [200], "speed": [0.8, 0.9, 1, 1.1, 1.2, 1.3], "health": [7000, 7500, 8000, 8500, 9000, 10000],
                    "damage": [700, 800, 900, 1000, 1100, 1200], "cTime": [4500], "cResource": [3000000 / 3],
                    "cStorage": [250], "bucket": [250], "targetGroup": [4],
                    "zombieSpeedMultiplier": [0.75], "zombieHealthMultiplier": [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                    "zombieDamageMultiplier": [1, 1.1, 1.2, 1.3, 1.4, 1.5], "resurrectCooldown": [7, 7, 6, 6, 5, 4]
                }
            },
            "IC1": {
                "index": 1, "page": 1, "order": 1, "resource": 2400, "time": 3600, "level": 1,
                "name": "#m_spurtz#", "classType": Spurtz, "description": "mi_Spurtz_desc",
                "stream": ["mi_Spurtz_stream", "mi_Spurtz_streambody", "quests/inferno_monster1.png"],
                "trainingCosts": [[2400, 3600], [4800, 7200], [7200, 10800], [9600, 14400], [14400, 21600]],
                "props": {
                    "speed": [1.2], "health": [400, 425, 450, 475, 510, 550], "damage": [160, 200, 200, 250, 300, 350],
                    "cTime": [15, 10, 8, 7, 6, 5], "cResource": [500, 1000, 2000, 4000, 6000, 10000],
                    "cStorage": [15], "bucket": [15], "targetGroup": [1], "hTime": [5, 3, 2],
                    "hResource": [150, 300, 600, 1200, 1800, 3000]
                }
            },
            // Additional inferno creatures abbreviated for file size...
            "C200": {
                "name": "AILooter1", "blocked": true,
                "props": {
                    "speed": [3], "health": [200], "damage": [20], "cTime": [10], "cResource": [10],
                    "cStorage": [10], "bucket": [50], "size": [32], "targetGroup": [3]
                }
            }
        };
        if (CREATURELOCKER.k_USE_REBALANCED_MONSTERS) {
            CREATURELOCKER._mainCreatures = RebalancedCreatures.REBALANCED_CREATURES;
            for (_loc1_ in CREATURELOCKER._mainCreatures) {
                CREATURELOCKER._mainCreatures[_loc1_].props.hResource = [10];
                CREATURELOCKER._mainCreatures[_loc1_].props.hTime = [2];
            }
        }
        CREATURELOCKER.modifyCreepData();
        CreepTypeManager.instance.AddExposedCreepTypes(CREATURELOCKER._mainCreatures);
    }

    private static modifyCreepData(): void {
        let _loc1_: number = 0;
        let _loc2_: string = null;
        if (MapRoomManager.instance.isInMapRoom3) {
            for (_loc2_ in CREATURELOCKER._mainCreatures) {
                _loc1_ = CREATURELOCKER._mainCreatures[_loc2_].props.cResource.length;
                for (let i = 0; i < _loc1_; i++) {
                    CREATURELOCKER._mainCreatures[_loc2_].props.cResource[i] *= 3;
                }
                _loc1_ = CREATURELOCKER._mainCreatures[_loc2_].props.cTime.length;
                for (let i = 0; i < _loc1_; i++) {
                    CREATURELOCKER._mainCreatures[_loc2_].props.cTime[i] *= 3;
                }
            }
        }
    }

    public static Tick(): void {
        CREATURELOCKER._unlocking = null;
        for (const i in CREATURELOCKER._lockerData) {
            if (CREATURELOCKER._lockerData[i].t == 1) {
                const isInfernoType = i.substring(0, 2) == "IC";
                if ((BASE.isInfernoMainYardOrOutpost && isInfernoType) || (!BASE.isInfernoMainYardOrOutpost && !isInfernoType)) {
                    CREATURELOCKER._unlocking = i;
                    break;
                }
            }
        }
        if (CREATURELOCKER._unlocking != null) {
            if (GLOBAL._lockerOverdrive > 0) {
                CREATURELOCKER._lockerData[CREATURELOCKER._unlocking].e -= 4;
            }
            if (CREATURELOCKER._lockerData[CREATURELOCKER._unlocking].e - GLOBAL.Timestamp() <= 0) {
                CREATURELOCKER._lockerData[CREATURELOCKER._unlocking].t = 2;
                GLOBAL.player.m_upgrades[CREATURELOCKER._unlocking] = { "level": 1 };
                ACHIEVEMENTS.Check("unlock_monster", 1);
                delete CREATURELOCKER._lockerData[CREATURELOCKER._unlocking].s;
                delete CREATURELOCKER._lockerData[CREATURELOCKER._unlocking].e;
                CREATURELOCKER._unlocking = null;
                QUESTS.Check();
            }
        }
        if (CREATURELOCKER._mc) {
            CREATURELOCKER._mc.Tick();
        }
    }

    public static Start(param1: string): boolean {
        const creatureID = param1;
        if (CREATURELOCKER._lockerData[creatureID]) return false;
        if (CREATURELOCKER._unlocking != null) {
            GLOBAL.Message(KEYS.Get("mon_alreadyunlocking"), KEYS.Get("btn_speedup"), STORE.ShowB, [3, 0, ["SP1", "SP2", "SP3", "SP4"]]);
            return false;
        }
        const creature = CREATURELOCKER._creatures[creatureID];
        if (GLOBAL._bLocker._lvl.Get() < creature.level) {
            GLOBAL.Message(KEYS.Get("mon_upgradelocker", { "v1": KEYS.Get(GLOBAL._bLocker._buildingProps.name), "v2": creature.level }));
            return false;
        }
        if (BASE.Charge(3, creature.resource)) {
            CREATURELOCKER._lockerData[creatureID] = { "t": 1, "s": GLOBAL.Timestamp(), "e": GLOBAL.Timestamp() + creature.time };
            CREATURELOCKER._unlocking = creatureID;
            BASE.Save();
            LOGGER.Stat([9, Number(creatureID.substr(1))]);
            return true;
        }
        return false;
    }

    public static Cancel(): void {
        if (CREATURELOCKER._unlocking) {
            delete CREATURELOCKER._lockerData[CREATURELOCKER._unlocking];
            BASE.Fund(3, CREATURELOCKER._creatures[CREATURELOCKER._unlocking].resource);
            CREATURELOCKER._unlocking = null;
        }
        CREATURELOCKER.Update();
        BASE.Save();
    }

    public static Show(): void {
        if (GLOBAL._bLocker && GLOBAL._bLocker._lvl.Get() >= 1) {
            if (!CREATURELOCKER._open) {
                CREATURELOCKER._open = true;
                GLOBAL.BlockerAdd();
                CREATURELOCKER._mc = GLOBAL._layerWindows.addChild(new CREATURELOCKERPOPUP()) as CREATURELOCKERPOPUP;
                CREATURELOCKER._mc.Center();
                CREATURELOCKER._mc.ScaleUp();
            }
        } else {
            GLOBAL.Message(KEYS.Get("msg_nomonsterlocker"));
        }
    }

    public static Hide(param1: MouseEvent = null): void {
        if (CREATURELOCKER._open) {
            GLOBAL.BlockerRemove();
            SOUNDS.Play("close");
            BASE.BuildingDeselect();
            CREATURELOCKER._open = false;
            GLOBAL._layerWindows.removeChild(CREATURELOCKER._mc);
            CREATURELOCKER._mc = null;
        }
    }

    public static Update(): void {
        if (CREATURELOCKER._mc) {
            CREATURELOCKER._mc.Update();
        }
    }

    public static Check(): string {
        const tmpArray: any[] = [];
        for (let i = 1; i <= 16; i++) {
            const _loc2_ = CREATURELOCKER._creatures["C" + i];
            const _loc3_ = _loc2_.props;
            tmpArray.push([_loc2_.page, _loc2_.resource, _loc2_.time, _loc2_.level, _loc2_.trainingCosts, _loc3_.speed, _loc3_.health, _loc3_.damage, _loc3_.armor, _loc3_.accuracy, _loc3_.cTime, _loc3_.cResource, _loc3_.cStorage, _loc3_.bucket, _loc3_.size]);
        }
        for (let i = 1; i <= 8; i++) {
            const _loc2_ = CREATURELOCKER._creatures["IC" + i];
            const _loc3_ = _loc2_.props;
            tmpArray.push([_loc2_.page, _loc2_.resource, _loc2_.time, _loc2_.level, _loc2_.trainingCosts, _loc3_.speed, _loc3_.health, _loc3_.damage, _loc3_.armor, _loc3_.accuracy, _loc3_.cTime, _loc3_.cResource, _loc3_.cStorage, _loc3_.bucket, _loc3_.size]);
        }
        return md5(JSON.encode(tmpArray));
    }

    public static GetAppropriateCreatures(): any {
        const _loc1_ = CREATURELOCKER._creatures;
        const _loc2_: any = {};
        for (const _loc3_ in _loc1_) {
            if (!((_loc3_.substr(0, 1) == "C" && BASE.isInfernoMainYardOrOutpost) || (_loc3_.substr(0, 1) == "I" && !BASE.isInfernoMainYardOrOutpost) || _loc3_ == "C200")) {
                _loc2_[_loc3_] = _loc1_[_loc3_];
            }
        }
        return _loc2_;
    }

    public static GetCreatures(param1: string = "full"): any {
        const _loc2_ = CREATURELOCKER._creatures;
        let _loc3_: any = {};
        switch (param1) {
            case "inferno": _loc3_ = CREATURELOCKER.GetInfernoCreatures(); break;
            case "above": _loc3_ = CREATURELOCKER.GetAboveCreatures(); break;
            default:
                for (const _loc4_ in _loc2_) {
                    if (!((_loc4_.substr(0, 1) == "C" && BASE.isInfernoMainYardOrOutpost) || (_loc4_.substr(0, 1) == "I" && !BASE.isInfernoMainYardOrOutpost) || _loc4_ == "C200")) {
                        _loc3_[_loc4_] = _loc2_[_loc4_];
                    }
                }
        }
        return _loc3_;
    }

    public static GetAboveCreatures(): any {
        const _loc1_ = CREATURELOCKER._creatures;
        const _loc2_: any = {};
        for (const _loc3_ in _loc1_) {
            if (_loc3_.substr(0, 1) == "C" && _loc3_ != "C200") {
                _loc2_[_loc3_] = _loc1_[_loc3_];
            }
        }
        return _loc2_;
    }

    public static maxCreatures(param1: string = "full"): number {
        let _loc2_ = 0;
        const _loc3_ = CREATURELOCKER.GetCreatures(param1);
        for (const _loc4_ in _loc3_) { _loc2_++; }
        return _loc2_;
    }

    public static GetInfernoCreatures(): any {
        const _loc1_ = CREATURELOCKER._creatures;
        const _loc2_: any = {};
        for (const _loc3_ in _loc1_) {
            if (_loc3_.substr(0, 1) == "I") {
                _loc2_[_loc3_] = _loc1_[_loc3_];
            }
        }
        return _loc2_;
    }

    public static get maxInfernoCreatures(): number {
        let _loc1_ = 0;
        const _loc2_ = CREATURELOCKER.GetInfernoCreatures();
        for (const _loc3_ in _loc2_) { _loc1_++; }
        return _loc1_;
    }

    public static CheckCreatureAvailable(param1: string): boolean {
        for (const _loc4_ in CREATURELOCKER._lockerData) {
            if (_loc4_ == param1) return true;
        }
        return false;
    }

    public static GetAvailableCreatures(): any {
        const _loc1_ = CREATURELOCKER._creatures;
        const _loc2_: any = {};
        const _loc3_ = MAPROOM_DESCENT.DescentPassed && !BASE.isInfernoMainYardOrOutpost;
        for (const _loc4_ in _loc1_) {
            if (_loc3_) {
                if (_loc4_ != "C200") _loc2_[_loc4_] = _loc1_[_loc4_];
            } else if (!((_loc4_.substr(0, 1) == "C" && BASE.isInfernoMainYardOrOutpost) || (_loc4_.substr(0, 1) == "I" && !BASE.isInfernoMainYardOrOutpost) || _loc4_ == "C200")) {
                _loc2_[_loc4_] = _loc1_[_loc4_];
            }
        }
        return _loc2_;
    }

    public static GetSortedCreatures(param1: boolean = false): any[] {
        const _loc2_ = CREATURELOCKER.GetAvailableCreatures();
        let _loc3_: any[] = [];
        let _loc4_: any[] = [];
        let _loc5_: any[] = [];
        if (!BASE.isInfernoMainYardOrOutpost) {
            const _loc8_ = CREATURELOCKER.GetCreatures("above");
            for (const _loc9_ in _loc8_) {
                const _loc10_ = CREATURELOCKER._creatures[_loc9_];
                if (!_loc10_.blocked || param1) {
                    _loc10_.id = _loc9_;
                    _loc10_.type = Number(_loc9_.substr(_loc9_.indexOf("C") + 1));
                    _loc3_.push(_loc10_);
                }
            }
            _loc3_.sort((a: any, b: any) => a.index - b.index);
        }
        if (MAPROOM_DESCENT.DescentPassed && (BASE.isInfernoMainYardOrOutpost || SubscriptionHandler.isEnabledForAll || HATCHERYCC.doesShowInfernoCreeps)) {
            const _loc12_ = CREATURELOCKER.GetCreatures("inferno");
            for (const _loc13_ in _loc12_) {
                const _loc14_ = CREATURELOCKER._creatures[_loc13_];
                if (!_loc14_.blocked || param1) {
                    _loc14_.id = _loc13_;
                    _loc4_.push(_loc14_);
                }
            }
            _loc4_.sort((a: any, b: any) => a.index - b.index);
        }
        if (_loc3_.length > 0) _loc5_ = _loc5_.concat(_loc3_);
        if (_loc4_.length > 0) _loc5_ = _loc5_.concat(_loc4_);
        return _loc5_;
    }

    public static getShortCreatureName(param1: string): string {
        if (CREATURELOCKER._creatures[param1].shortName) {
            return CREATURELOCKER._creatures[param1].shortName;
        }
        return CREATURELOCKER._creatures[param1].name;
    }
}
