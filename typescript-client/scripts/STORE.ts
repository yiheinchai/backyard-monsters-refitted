import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import MovieClip from "openfl/display/MovieClip";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";
import Rectangle from "openfl/geom/Rectangle";

import { SecNum } from "./com/cc/utils/SecNum";
import { BYMConfig } from "./com/monsters/configs/BYMConfig";
import { ImageCache } from "./com/monsters/display/ImageCache";
import { ScrollSet } from "./com/monsters/display/ScrollSet";
import { Player } from "./com/monsters/player/Player";
import { MovieClipUtils } from "./com/monsters/utils/MovieClipUtils";
import { STOREPOPUP } from "./STOREPOPUP";
import { STREAMLINESPEEDUP_CLIP } from "./STREAMLINESPEEDUP_CLIP";
import { STOREITEM } from "./STOREITEM";
import { ACADEMY } from "./ACADEMY";
import { PLEASEWAIT } from "./PLEASEWAIT";
import { MAPROOM_DESCENT } from "./MAPROOM_DESCENT";
import { ButtonBrown } from "./ButtonBrown";
import { Button } from "./Button";
import { popup_purchase } from "./popup_purchase";

// Lazy imports to break circular dependency chains
function getInstanceManager(): any { return require("./com/monsters/managers/InstanceManager").InstanceManager; }
function getMapRoomManager(): any { return require("./com/monsters/maproom_manager/MapRoomManager").MapRoomManager; }
function getMonsterBase(): any { return require("./com/monsters/monsters/MonsterBase").MonsterBase; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getBASE(): any { return require("./BASE").BASE; }
function getBFOUNDATION(): any { return require("./BFOUNDATION").BFOUNDATION; }
function getBWALL(): any { return require("./BWALL").BWALL; }
function getBUY(): any { return require("./BUY").BUY; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getLOGGER(): any { return require("./LOGGER").LOGGER; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }
function getQUEUE(): any { return require("./QUEUE").QUEUE; }
function getUI2(): any { return require("./UI2").UI2; }
function getMAP(): any { return require("./MAP").MAP; }
function getPLANNER(): any { return require("./PLANNER").PLANNER; }
function getTUTORIAL(): any { return require("./TUTORIAL").TUTORIAL; }
function getBUILDINGS(): any { return require("./BUILDINGS").BUILDINGS; }
function getCREATURELOCKER(): any { return require("./CREATURELOCKER").CREATURELOCKER; }
function getMONSTERLAB(): any { return require("./MONSTERLAB").MONSTERLAB; }
function getCREATURES(): any { return require("./CREATURES").CREATURES; }
function getQUESTS(): any { return require("./QUESTS").QUESTS; }
function getLOGIN(): any { return require("./LOGIN").LOGIN; }
function getBunker(): any { return require("./Bunker").Bunker; }


export class STORE {
    public static _storeTabs: any[];
    public static _storeItems: any;
    public static _storeInventory: any;
    public static _grouping: any[];
    public static _storeData: any;
    public static _mc: STOREPOPUP;
    public static _streamline: STREAMLINESPEEDUP_CLIP;
    public static _streamline_time: number;
    public static _streamline_cost: number;
    public static _items: any;
    public static _itemsHeight: number;
    public static _jumpTo: number;
    public static _scrollRect: Rectangle;
    public static _code: string;
    public static _cost: number;
    public static _quantity: number;
    public static _duration: number;
    public static _update: any[];
    public static _tab: number;
    public static _page: number;
    public static _open: boolean;
    public static _facebookPurchaseItemCode: string;
    public static _scroller: ScrollSet;
    public static _scrollPos: number = 0;
    public static _scrollUpdate: boolean = true;
    public static _scrollPosUpdate: boolean = false;
    public static _customPage: any[] = [];
    public static _zazzleMC: MovieClip;
    public static m_tutorialBlock: boolean;
    public static _repairCount: number = 0;
    public static _allowInfernoResourcesAboveGround: boolean = true;

    constructor() {}

    public static Data(storeItems: any, storeData: any, param3: any = null): void {
        STORE._storeItems = {};
        STORE._storeData = {};
        STORE._storeInventory = {};
        getGLOBAL()._monsterOverdrive = new SecNum(0);
        if (!storeItems || !storeData) {
            return;
        }
        if (storeItems != null) {
            STORE._storeItems = storeItems;
            STORE._storeData = storeData;
            if (param3) {
                STORE.InventoryImport(param3);
            }
            STORE.Variables();
            STORE.ProcessPurchases();
        }
    }

    private static InventoryImport(param1: any): void {
        for (const key in param1) {
            STORE._storeInventory[key] = new SecNum(param1[key]);
        }
    }

    public static InventoryExport(): string {
        const result: any = {};
        for (const key in STORE._storeInventory) {
            result[key] = STORE._storeInventory[key].Get();
        }
        return JSON.stringify(result);
    }

    public static GetHealAllShinyCost(): number {
        const player: Player = getGLOBAL().player;
        const monsterCount: number = player.monsterList.length;
        let totalCost: number = 0;
        const isInferno: boolean = getBASE().isInfernoMainYardOrOutpost;
        
        for (let i = 0; i < monsterCount; i++) {
            const creatureID: string = player.monsterList[i].m_creatureID;
            totalCost += STORE.getShinyCostforCreep(creatureID);
        }
        
        if (!isInferno) {
            const bunkers: any[] = getInstanceManager().getInstancesByClass(getBunker());
            for (let i = 0; i < bunkers.length; i++) {
                const creatureID: string = "B" + bunkers[i]._id;
                totalCost += STORE.getShinyCostforCreep(creatureID);
            }
        }
        return totalCost;
    }

    private static getShinyCostforCreep(creatureID: string): number {
        const player: Player = getGLOBAL().player;
        const resourceCost: number = getGLOBAL().getShinyCostFromResourceAmt(
            getGLOBAL().player.getResourceCostByID(creatureID) - getGLOBAL().player.getResourceCostByID(creatureID, true)
        );
        const healTime: number = player.getSecsTillDoneByID(creatureID, true);
        return resourceCost + STORE.GetTimeCost(healTime, false) * getGLOBAL().ABTestHealingTimeShinyMod();
    }

    public static GetInstantBuyCost(param1: any): number {
        return STORE.GetTimeCost(param1.time) + STORE.GetResourceCost([param1.r1, param1.r2, param1.r3, param1.r4]);
    }

    public static GetTimeCost(seconds: number, freeUnder5Min: boolean = true): number {
        if (freeUnder5Min && seconds <= 300) {
            return 0;
        }
        const cost1: number = Math.ceil(seconds * 20 / 60 / 60);
        const cost2: number = Math.floor(Math.sqrt(seconds * 0.8));
        return Math.min(cost1, cost2);
    }

    public static GetResourceCost(resources: number[]): number {
        let total: number = 0;
        for (let i = 0; i < resources.length; i++) {
            total += resources[i];
        }
        return STORE.GetShinyCostFromTotalResources(total);
    }

    public static GetShinyCostFromTotalResources(total: number): number {
        return Math.ceil(Math.pow(Math.sqrt(total / 2), 0.75));
    }

    public static Variables(): void {
        // Sets up store item groupings and calculates dynamic costs
        // This is a large function - simplified structure preserved
        if (getBASE().isOutpost) {
            STORE._grouping = [
                [getMapRoomManager().instance.isInMapRoom3 ? [] : ["BST", "BLK2", "BLK3", "BLK4", "BLK5"]],
                [getMapRoomManager().instance.isInMapRoom3 ? [] : ["BR11", "BR12", "BR13", "BR21", "BR22", "BR23", "BR31", "BR32", "BR33", "BR41", "BR42", "BR43"]],
                [getMapRoomManager().instance.isInMapRoom3 ? ["SP1", "SP2", "SP3", "SP4", "FIX"] : ["SP1", "SP2", "SP3", "SP4", "POD", "FIX", "HOD", "HOD2", "HOD3"]],
                [getMapRoomManager().instance.isInMapRoom3 ? [] : ["PRO1", "PRO2", "PRO3", "TOD", "EXH"]]
            ];
        } else if (getBASE().isMainYard) {
            if (MAPROOM_DESCENT.DescentPassed) {
                STORE._grouping = [
                    [["BEW", "BST", "ENL", "BLK2", "BLK3", "BLK4", "BLK5"]],
                    [["BR11", "BR12", "BR13", "BR21", "BR22", "BR23", "BR31", "BR32", "BR33", "BR41", "BR42", "BR43", "BR11I", "BR12I", "BR13I", "BR21I", "BR22I", "BR23I", "BR31I", "BR32I", "BR33I", "BR41I", "BR42I", "BR43I", "BIP"]],
                    [["SP1", "SP2", "SP3", "SP4", "POD", "FIX", "HOD", "HOD2", "HOD3"]],
                    [getMapRoomManager().instance.isInMapRoom3 ? ["PRO1", "PRO2", "PRO3", "MOD", "MDOD", "MSOD", "TOD"] : ["PRO1", "PRO2", "PRO3", "MOD", "MDOD", "MSOD", "EXH", "TOD"]]
                ];
            } else {
                STORE._grouping = [
                    [["BEW", "BST", "ENL", "BLK2", "BLK3", "BLK4", "BLK5"]],
                    [["BR11", "BR12", "BR13", "BR21", "BR22", "BR23", "BR31", "BR32", "BR33", "BR41", "BR42", "BR43", "BIP"]],
                    [["SP1", "SP2", "SP3", "SP4", "POD", "FIX", "HOD", "HOD2", "HOD3"]],
                    [getMapRoomManager().instance.isInMapRoom3 ? ["PRO1", "PRO2", "PRO3", "MOD", "MDOD", "MSOD", "TOD"] : ["PRO1", "PRO2", "PRO3", "MOD", "MDOD", "MSOD", "EXH", "TOD"]]
                ];
            }
        } else {
            STORE._grouping = [
                [["ENLI", "BLK2I", "BLK3I"]],
                [["BR11I", "BR12I", "BR13I", "BR21I", "BR22I", "BR23I", "BR31I", "BR32I", "BR33I", "BR41I", "BR42I", "BR43I", "BIP"]],
                [["SP1", "SP2", "SP3", "SP4", "FIX", "HODI", "HOD2I", "HOD3I"]],
                [getMapRoomManager().instance.isInMapRoom3 ? ["PRO1", "PRO2", "PRO3", "TODI"] : ["PRO1", "PRO2", "PRO3", "EXHI", "TODI"]]
            ];
        }
        
        // Calculate resource costs for buy resources items
        STORE.calculateResourceCosts();
        // Calculate speedup costs
        STORE.calculateSpeedupCosts();
        // Calculate repair costs
        STORE.calculateRepairCosts();
        // Calculate wall upgrade costs
        STORE.calculateWallCosts();
    }

    private static calculateResourceCosts(): void {
        for (let resourceIndex = 1; resourceIndex <= 4; resourceIndex++) {
            let resourceMax = getBASE()._resources["r" + resourceIndex + "max"] * 0.1;
            let iResourceMax = getBASE()._iresources["r" + resourceIndex + "max"] * 0.1;
            
            let mainStoreItems: any;
            let infernoStoreItems: any;
            
            if (getBASE().isInfernoMainYardOrOutpost) {
                mainStoreItems = STORE._storeItems["BR" + resourceIndex + "1I"];
            } else {
                mainStoreItems = STORE._storeItems["BR" + resourceIndex + "1"];
                infernoStoreItems = STORE._storeItems["BR" + resourceIndex + "1I"];
            }
            
            if (mainStoreItems) {
                mainStoreItems.t = getKEYS().Get("str_top_extra", {
                    "v1": getGLOBAL().FormatNumber(resourceMax),
                    "v2": getKEYS().Get(getGLOBAL()._resourceNames[resourceIndex - 1])
                });
                
                if (getBASE()._resources["r" + resourceIndex].Get() + resourceMax < getBASE()._resources["r" + resourceIndex + "max"]) {
                    mainStoreItems.c = [Math.ceil(Math.pow(Math.sqrt(resourceMax / 2), 0.75))];
                    mainStoreItems.quantity = resourceMax;
                } else {
                    mainStoreItems.c = [0];
                    mainStoreItems.quantity = 0;
                }
            }
        }
    }

    private static calculateSpeedupCosts(): void {
        if (getGLOBAL()._selectedBuilding) {
            let cost = 0;
            const building = getGLOBAL()._selectedBuilding;
            
            if (building._repairing) {
                cost = STORE.GetTimeCost(building._repairTime);
            } else if (building._countdownBuild.Get() > 0) {
                cost = STORE.GetTimeCost(building._countdownBuild.Get());
            } else if (building._countdownUpgrade.Get() > 0) {
                cost = STORE.GetTimeCost(building._countdownUpgrade.Get());
            } else if (building._countdownFortify.Get() > 0) {
                cost = STORE.GetTimeCost(building._countdownFortify.Get());
            }
            
            if (STORE._storeItems.SP4) {
                STORE._storeItems.SP4.c = [cost];
            }
        }
    }

    private static calculateRepairCosts(): void {
        let totalTime = 0;
        STORE._repairCount = 0;
        let repairableCount = 0;
        
        const buildings: BFOUNDATION[] = getInstanceManager().getInstancesByClass(getBFOUNDATION());
        for (const building of buildings) {
            if (building._repairing) {
                STORE._repairCount++;
                if (building._repairTime > 300) {
                    totalTime += building._repairTime;
                    repairableCount++;
                }
            }
        }
        
        if (STORE._storeItems.FIX) {
            STORE._storeItems.FIX.c = [STORE.GetTimeCost(totalTime) + repairableCount * 10];
            STORE._storeItems.FIX.d = getKEYS().Get("desc_repairbdgs", { "v1": STORE._repairCount });
            STORE._storeItems.FIX.t = getKEYS().Get("str_repairbdgs");
        }
    }

    private static calculateWallCosts(): void {
        const walls: BFOUNDATION[] = getInstanceManager().getInstancesByClass(getBWALL());
        const costLvl2 = 3, costLvl3 = 6, costLvl4 = 10, costLvl5 = 15;
        
        // Level 2 walls
        let cost = 0, resTotal = 0, count = 0;
        for (const wall of walls) {
            if (wall._lvl == null || wall._lvl.Get() <= 1) {
                cost += costLvl2;
                resTotal += 10000;
                count++;
            }
        }
        
        if (getBASE().isInfernoMainYardOrOutpost && STORE._storeItems.BLK2I) {
            STORE._storeItems.BLK2I.c = [cost];
            STORE._storeItems.BLK2I.t = getKEYS().Get("#bi_wall_2#");
        } else if (STORE._storeItems.BLK2) {
            STORE._storeItems.BLK2.c = [cost];
            STORE._storeItems.BLK2.t = getKEYS().Get("str_stonewalls");
        }
    }

    public static AddInventory(itemCode: string): void {
        // Find item in grouping and add to inventory
        let found = false;
        for (let i = 0; i < STORE._grouping.length && !found; i++) {
            for (let j = 0; j < STORE._grouping[i].length && !found; j++) {
                for (let k = 0; k < STORE._grouping[i][j].length && !found; k++) {
                    if (STORE._grouping[i][j][k] === itemCode) {
                        found = true;
                    }
                }
            }
        }
        
        if (found) {
            if (STORE._storeInventory[itemCode]) {
                STORE._storeInventory[itemCode].Add(1);
            } else {
                STORE._storeInventory[itemCode] = new SecNum(1);
            }
            STORE.Update();
            getBASE().Save();
        }
    }

    public static GetInventory(itemCode: string): number {
        let code = itemCode;
        if (code.substr(0, 2) === "SP") {
            code = code.substr(0, 3);
        }
        if (STORE._storeInventory[code]) {
            return STORE._storeInventory[code].Get();
        }
        return 0;
    }

    public static Show(tab: number = 1, page: number = 1, customPage: any[] = null, force: boolean = false): (e: MouseEvent) => void {
        return (e: MouseEvent): void => {
            STORE.ShowB(tab, page, customPage, force);
        };
    }

    public static ShowB(tab: number, page: number = 0, customPage: any[] = null, force: boolean = false): void {
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
            STORE.m_tutorialBlock = true;
            if (getGLOBAL()._bStore || !getBASE().isMainYard) {
                getSOUNDS().Play("click1");
                if (!getBASE().isMainYard || getGLOBAL()._bStore._canFunction || force) {
                    if (!STORE._open) {
                        STORE._open = true;
                        STORE._mc = new STOREPOPUP();
                        STORE._mc.Center();
                        STORE._mc.ScaleUp();
                        getGLOBAL().BlockerAdd();
                        getGLOBAL()._layerWindows.addChild(STORE._mc);
                        if (getGLOBAL()._newBuilding) {
                            getGLOBAL()._newBuilding.Cancel();
                        }
                        if (getBUILDINGS()._open) {
                            getBUILDINGS().Hide();
                        }
                    }
                    STORE._customPage = customPage;
                    
                    if (getTUTORIAL()._stage < 200) {
                        STORE._mc.tShinyBalance.visible = false;
                        STORE._mc.bAdd.visible = false;
                    } else {
                        STORE._mc.tShinyBalance.visible = true;
                        STORE._mc.bAdd.SetupKey("ui_topaddshiny");
                        STORE._mc.bAdd.addEventListener(MouseEvent.CLICK, (e: MouseEvent): void => {
                            getGLOBAL().Message(getKEYS().Get("disabled_addshiny"));
                        });
                        if (getBASE()._credits.Get() <= 250) {
                            STORE._mc.bAdd.Highlight = true;
                        }
                    }
                    
                    STORE._mc.b1.SetupKey("str_construction", false, 0, 0, "#ECBF88");
                    STORE._mc.b1.addEventListener(MouseEvent.CLICK, STORE.SwitchClick(1, 0, true));
                    STORE._mc.b2.SetupKey("str_resources", false, 0, 0, "#ECBF88");
                    STORE._mc.b2.addEventListener(MouseEvent.CLICK, STORE.SwitchClick(2, 0, true));
                    STORE._mc.b3.SetupKey("str_speedups", false, 0, 0, "#ECBF88");
                    STORE._mc.b3.addEventListener(MouseEvent.CLICK, STORE.SwitchClick(3, 0, true));
                    STORE._mc.b4.SetupKey("str_protection", false, 0, 0, "#ECBF88");
                    STORE._mc.b4.addEventListener(MouseEvent.CLICK, STORE.SwitchClick(4, 0, true));
                    
                    if (!getGLOBAL()._flags.viximo && !getGLOBAL()._flags.kongregate) {
                        STORE._mc.b5.SetupKey("str_zazzle", false, 0, 0, "#ECBF88");
                        STORE._mc.b5.addEventListener(MouseEvent.CLICK, STORE.SwitchClick(5, 0, true));
                    } else {
                        STORE._mc.b5.visible = false;
                    }
                    
                    STORE.Switch(tab, page, STORE._customPage);
                } else {
                    getGLOBAL().Message(getKEYS().Get("str_damaged"));
                }
            } else {
                getGLOBAL().Message(getKEYS().Get("str_notbuilt"));
            }
        }
        STORE.Update();
    }

    public static SpeedUp(itemCode: string): void {
        if (getGLOBAL()._showStreamlinedSpeedUps && getTUTORIAL().hasFinished) {
            STORE.CalcCost(itemCode);
            STORE._streamline = null;
            const building = getGLOBAL()._selectedBuilding;
            let countdown = building._countdownUpgrade.Get() + building._countdownBuild.Get() + building._countdownFortify.Get();
            if (building._repairing) {
                countdown = building._repairTime;
            }
            
            if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD && building) {
                STORE._streamline = new STREAMLINESPEEDUP_CLIP();
                // Setup streamline popup based on countdown
                if (countdown > 0) {
                    if (STORE._streamline_cost === 0) {
                        STORE._streamline.tTitle.htmlText = getKEYS().Get("streamspd_close_title");
                        STORE._streamline.mcInstant.bAction.Setup(getKEYS().Get("str_finishnow"));
                    } else {
                        STORE._streamline.tTitle.htmlText = getKEYS().Get("streamspd_title");
                        STORE._streamline.mcInstant.bAction.Setup(getKEYS().Get("btn_useshiny", { "v1": STORE._streamline_cost }));
                    }
                }
                STORE._streamline.mcInstant.bAction.addEventListener(MouseEvent.CLICK, STORE.StreamlineBuy);
                getPOPUPS().Push(STORE._streamline, null, null, null, null);
            }
        } else if (itemCode === "SP4") {
            STORE.ShowB(3, 0, ["SP1", "SP2", "SP3", "SP4"]);
        } else if (itemCode === "FIX") {
            STORE.ShowB(3, 1, ["FIX"], true);
        } else if (itemCode === "HAMS") {
            STORE.ShowB(3, 1, ["HAMS"], true);
        }
    }

    public static StreamlineBuy(e: MouseEvent = null): void {
        if (STORE._streamline_time < 300) {
            STORE.BuyB("SP1");
            getPOPUPS().Next();
        } else {
            if (STORE._streamline_cost > getBASE()._credits.Get()) {
                getPOPUPS().Next();
                getPOPUPS().DisplayGetShiny(e);
                return;
            }
            STORE.BuyB("SP4");
            getPOPUPS().Next();
        }
    }

    public static SwitchClick(tab: number, page: number, click: boolean = false): (e: MouseEvent) => void {
        return (e: MouseEvent = null): void => {
            STORE._customPage = null;
            STORE.Switch(tab, page, null, click);
            STORE._scroller.ScrollTo(0, false);
        };
    }

    public static CalcCost(itemCode: string, returnNumber: boolean = false): any {
        // Calculate cost for item - returns formatted string or number
        const storeItem = STORE._storeItems[itemCode];
        const storeDataItem = STORE._storeData[itemCode];
        let quantity = 0;
        
        if (storeDataItem) {
            quantity = storeDataItem.q;
        }
        if (storeItem.i) {
            quantity = 0;
        }
        
        let cost = storeItem.c[quantity] || storeItem.c[0];
        
        if (storeItem.fbc_cost && storeItem.fbc_cost[0] > 0) {
            cost = storeItem.fbc_cost[quantity] || storeItem.fbc_cost[0];
        }
        
        STORE._streamline_cost = cost;
        
        if (returnNumber) {
            return cost;
        }
        return "<b>" + getGLOBAL().FormatNumber(cost) + "</b>";
    }

    public static Switch(tab: number, page: number, customPage: any[] = null, playSound: boolean = false): void {
        if (getTUTORIAL()._stage === getTUTORIAL().k_STAGE_SNIPER_SPEEDUP && tab !== 3) {
            return;
        }
        if (playSound) {
            getSOUNDS().Play("click1");
        }
        STORE.Variables();
        STORE.ZazzleClear();
        
        if (tab < 1) tab = 1;
        if (!STORE._customPage) {
            if (page < 0) page = 0;
            if (page > 1) page = 1;
        }
        
        STORE._scrollUpdate = tab !== STORE._tab;
        STORE._scrollPosUpdate = page !== STORE._page;
        STORE._tab = tab;
        STORE._page = page;
        
        // Highlight active tab
        for (let i = 1; i <= 5; i++) {
            (STORE._mc["b" + i] as ButtonBrown).Highlight = false;
        }
        
        if (!STORE._customPage) {
            (STORE._mc["b" + STORE._tab] as ButtonBrown).Highlight = true;
            STORE._mc.window.gotoAndStop(STORE._tab);
        } else {
            STORE._mc.window.gotoAndStop(6);
        }
        
        STORE._update = [];
        if (STORE._items && STORE._items.parent) {
            STORE._items.parent.removeChild(STORE._items);
            STORE._items = null;
        }
        
        STORE._items = (STORE._mc.window as any).content.addChild(new MovieClip());
        STORE._items.x = 5;
        STORE._items.y = 8;
        
        if (STORE._scroller && STORE._scroller.parent && STORE._scrollUpdate) {
            STORE._scroller.parent.removeChild(STORE._scroller);
            STORE._scroller = null;
        }
        
        if (STORE._scrollUpdate) {
            STORE._scroller = new ScrollSet();
            STORE._scroller.x = 327;
            STORE._scroller.y = -200.05;
            STORE._scroller.width = 21;
            STORE._mc.addChild(STORE._scroller);
            STORE._scroller.AutoHideEnabled = false;
        }
        
        // Get items for this tab
        let groupArray: string[];
        if (STORE._customPage) {
            groupArray = STORE._customPage;
        } else if (tab === 5) {
            groupArray = [];
            STORE.ZazzleAdd();
        } else {
            groupArray = STORE._grouping[STORE._tab - 1][0];
        }
        
        // Create store items
        STORE.createStoreItems(groupArray);
        
        (STORE._mc.window as any).content.mask = (STORE._mc.window as any).msk;
        if (STORE._scrollUpdate) {
            STORE._scroller.Init((STORE._mc.window as any).content as Sprite, (STORE._mc.window as any).msk as MovieClip, 0, 0, 391, 30);
            if (STORE._scrollPosUpdate) {
                STORE._scroller.ScrollTo(0, false);
            }
        }
    }

    private static createStoreItems(groupArray: string[]): void {
        let yPos = 0;
        let xPos = 0;
        let itemCount = 0;
        const itemsPerRow = 3;
        const itemSpacing = 8;
        
        for (let i = 0; i < groupArray.length; i++) {
            const item = groupArray[i];
            const storeItem = new STOREITEM();
            storeItem.name = item;
            
            // Position item
            storeItem.x = xPos;
            storeItem.y = yPos;
            
            // Setup item content
            const storeItemData = STORE._storeItems[item];
            if (storeItemData) {
                storeItem.tA.htmlText = "<b>" + storeItemData.t + "</b><br>" + storeItemData.d;
                storeItem.bBuy.SetupKey("btn_buy");
                storeItem.bBuy.addEventListener(MouseEvent.MOUSE_DOWN, STORE.Buy(item));
            }
            
            STORE._items.addChild(storeItem);
            
            itemCount++;
            const row = Math.floor(itemCount / itemsPerRow);
            xPos = (itemCount % itemsPerRow) * 220 + (itemCount % itemsPerRow) * 8;
            yPos = row * 150 + row * itemSpacing;
        }
    }

    public static Update(): void {
        if (STORE._open) {
            STORE._mc.tShinyBalance.htmlText = "<b>" + getGLOBAL().FormatNumber(getBASE()._credits.Get()) + " <font size=\"12\">" + getKEYS().Get("#r_shiny#") + "</font></b>";
            STORE.Switch(STORE._tab, STORE._page);
        }
    }

    public static Hide(e: MouseEvent = null): void {
        if (getTUTORIAL()._stage === getTUTORIAL().k_STAGE_SNIPER_SPEEDUP && STORE.m_tutorialBlock) {
            return;
        }
        if (STORE._open) {
            getGLOBAL().BlockerRemove();
            getSOUNDS().Play("close");
            STORE._open = false;
            getGLOBAL()._layerWindows.removeChild(STORE._mc);
            STORE._tab = 0;
            STORE._page = 0;
            STORE._mc = null;
        }
    }

    public static Buy(itemCode: string): (e: MouseEvent) => void {
        return (e: MouseEvent = null): void => {
            if (getBASE()._pendingPurchase.length === 0) {
                const storeItem = STORE._storeItems[itemCode];
                let costs: number[];
                let isFBC = false;
                
                if (storeItem.fbc_cost && storeItem.fbc_cost[0] > 0) {
                    isFBC = true;
                    costs = storeItem.fbc_cost;
                } else {
                    costs = storeItem.c;
                }
                
                let cost = costs[0];
                if (STORE._storeData[itemCode] && !storeItem.i) {
                    cost = costs[STORE._storeData[itemCode].q];
                }
                
                if (isFBC) {
                    STORE.FacebookCreditPurchase(itemCode);
                } else {
                    let inventoryCode = itemCode;
                    if (inventoryCode.substr(0, 2) === "SP") {
                        inventoryCode = inventoryCode.substr(0, 3);
                    }
                    
                    if (STORE._storeInventory[inventoryCode] && STORE._storeInventory[inventoryCode].Get() > 0) {
                        STORE._storeInventory[inventoryCode].Add(-1);
                        if (STORE._storeInventory[inventoryCode].Get() <= 0) {
                            delete STORE._storeInventory[inventoryCode];
                        }
                        STORE.BuyB(itemCode, true);
                    } else if (getBASE()._credits.Get() >= cost) {
                        STORE.BuyB(itemCode);
                    } else {
                        getPOPUPS().DisplayGetShiny();
                    }
                }
            }
        };
    }

    public static BuyB(itemCode: string, fromInventory: boolean = false): void {
        const storeItem = STORE._storeItems[itemCode];
        let costs: number[];
        let isFBC = false;
        
        if (fromInventory) {
            isFBC = false;
            costs = storeItem.c;
        } else if (storeItem.fbc_cost && storeItem.fbc_cost[0] > 0) {
            isFBC = true;
            costs = storeItem.fbc_cost;
        } else {
            isFBC = false;
            costs = storeItem.c;
        }
        
        let cost = costs[0];
        if (STORE._storeData[itemCode] && !storeItem.i) {
            cost = costs[STORE._storeData[itemCode].q];
        }
        
        if (STORE._storeData[itemCode] && STORE._storeData[itemCode].q >= storeItem.c.length && !storeItem.i) {
            getGLOBAL().Message(getKEYS().Get("str_prob_alreadyhave"));
            return;
        }
        
        let quantity = storeItem.quantity || 1;
        if (itemCode.substr(0, 2) === "BR" || itemCode.substr(0, 3) === "SP4") {
            quantity = cost;
        }
        
        if (!isFBC && !fromInventory) {
            getBASE()._credits.Add(-cost);
            getBASE()._hpCredits -= cost;
        }
        
        // Process specific item types
        STORE.processItemPurchase(itemCode, cost, quantity, fromInventory);
        
        // Update store data
        if (STORE._storeData[itemCode]) {
            STORE._storeData[itemCode].q += 1;
            if (storeItem.du > 0) {
                STORE._storeData[itemCode].s = getGLOBAL().Timestamp();
                STORE._storeData[itemCode].e = getGLOBAL().Timestamp() + storeItem.du;
            }
        } else {
            STORE._storeData[itemCode] = { "q": 1 };
            if (storeItem.du > 0) {
                STORE._storeData[itemCode].s = getGLOBAL().Timestamp();
                STORE._storeData[itemCode].e = getGLOBAL().Timestamp() + storeItem.du;
            }
        }
        
        getBASE().CalcResources();
        getUI2().Update();
        STORE.ProcessPurchases();
        
        if (itemCode === "ENL" || itemCode === "ENLI") {
            if (!BYMConfig.instance.RENDERER_ON) {
                getMAP().Edge();
            } else {
                getMAP().swapBG(getMAP().texture);
            }
        }
        
        if (isFBC) {
            getBASE().Save(0, false, true);
        } else if (cost > 0) {
            if (fromInventory) {
                let logCode = itemCode;
                if (logCode.substr(0, 2) === "SP") {
                    logCode = logCode.substr(0, 3);
                }
                getBASE().Purchase(logCode, 1, "store", true);
            } else {
                getBASE().Purchase(itemCode, quantity, "store");
            }
        } else {
            getBASE().Save();
        }
        
        if (storeItem.a) {
            STORE.m_tutorialBlock = false;
            STORE.Hide();
        } else {
            STORE.Switch(STORE._tab, STORE._page);
        }
        
        getLOGGER().Stat([13, itemCode, cost]);
        if (!fromInventory) {
            STORE.BuyC(itemCode, cost);
        }
    }

    private static processItemPurchase(itemCode: string, cost: number, quantity: number, fromInventory: boolean): void {
        // Handle specific item purchases
        if (itemCode.substr(0, 3) === "BEW") {
            getQUEUE().Spawn(1);
        }
        
        if (itemCode.substr(0, 3) === "BLK") {
            const wallLevel = parseInt(itemCode.substr(3, 1));
            const walls: BFOUNDATION[] = getInstanceManager().getInstancesByClass(getBWALL());
            for (const wall of walls) {
                if (wall._countdownBuild.Get() > 0) {
                    wall.Constructed();
                }
                if (wall._countdownUpgrade.Get() > 0) {
                    wall.Upgraded();
                }
                while (wall._lvl.Get() < wallLevel) {
                    wall.Upgraded();
                }
            }
        }
        
        if (itemCode.substr(0, 2) === "BR") {
            const resourceType = parseInt(itemCode.substr(2, 1));
            const resourceQuantity = STORE._storeItems[itemCode].quantity;
            if (getGLOBAL()._loadmode === getGLOBAL().e_BASE_MODE.BUILD && itemCode.substr(itemCode.length - 1) === "I") {
                getBASE().Fund(resourceType, Math.ceil(resourceQuantity), false, null, true);
            } else {
                getBASE().Fund(resourceType, Math.ceil(resourceQuantity));
            }
            getBASE().PointsAdd(Math.ceil(resourceQuantity * 0.3));
        }
        
        if (itemCode.substr(0, 2) === "SP") {
            STORE.processSpeedup(itemCode, cost);
        }
        
        if (itemCode === "FIX") {
            const buildings: BFOUNDATION[] = getInstanceManager().getInstancesByClass(getBFOUNDATION());
            for (const building of buildings) {
                if (building.health < building.maxHealth) {
                    building.setHealth(building.maxHealth);
                    building.Repaired();
                }
            }
        }
        
        if (itemCode === "HAMS") {
            getGLOBAL().player.healInstantAll();
        }
    }

    private static processSpeedup(itemCode: string, cost: number): void {
        const building = getGLOBAL()._selectedBuilding;
        let speedup = 0;
        
        if (itemCode.substr(2, 1) === "1") speedup = 5 * 60;
        if (itemCode.substr(2, 1) === "2") speedup = 60 * 60;
        if (itemCode.substr(2, 1) === "3") speedup = 60 * 60 * 2;
        
        if (building._repairing) {
            building.setHealth(building.health + Math.ceil(building.maxHealth / building._repairTime) * speedup);
            if (itemCode.substr(2, 1) === "4" || itemCode.substr(2, 1) === "1" || building.health > building.maxHealth) {
                building.setHealth(building.maxHealth);
            }
        } else if (building._countdownBuild.Get() > 0) {
            building._countdownBuild.Add(-speedup);
            if (building._countdownBuild.Get() <= 0 || itemCode.substr(2, 1) === "4") {
                building._countdownBuild.Set(0);
                building.Constructed();
                building.Update();
            }
        } else if (building._countdownUpgrade.Get() > 0) {
            building._countdownUpgrade.Add(-speedup);
            if (building._countdownUpgrade.Get() <= 0 || itemCode.substr(2, 1) === "4") {
                building._countdownUpgrade.Set(0);
                building.Upgraded();
                building.Update();
            }
        } else if (building._countdownFortify.Get() > 0) {
            building._countdownFortify.Add(-speedup);
            if (building._countdownFortify.Get() <= 0 || itemCode.substr(2, 1) === "4") {
                building._countdownFortify.Set(0);
                building.Fortified();
                building.Update();
            }
        }
        
        getQUESTS().Check();
    }

    public static BuyC(itemCode: string, cost: number): void {
        if (getTUTORIAL()._stage > 200) {
            // Show purchase confirmation popup for certain items
            const confirmItems: any = {
                "BEW": ["str_code_bew_title", "str_code_bew_body"],
                "BST": ["str_code_bst_title", "str_code_bst_body"],
                "ENL": ["str_code_enl_title", "str_code_enl_body"],
                "BIP": ["str_code_bip_title", "str_code_bip_body"]
            };
            
            if (confirmItems[itemCode]) {
                const mc = new popup_purchase();
                mc.gotoAndStop(itemCode);
                mc.tA.htmlText = "<b>" + getKEYS().Get(confirmItems[itemCode][0]) + "</b>";
                mc.tB.htmlText = getKEYS().Get(confirmItems[itemCode][1]);
                getPOPUPS().Push(mc, null, null, "");
            } else if (cost > 0 && !STORE._storeItems[itemCode].a) {
                getGLOBAL().Message(getKEYS().Get("msg_purchase_complete", { "v1": STORE._storeItems[itemCode].t }));
            }
        }
    }

    public static FacebookCreditPurchase(itemCode: string): void {
        const storeItem = STORE._storeItems[itemCode];
        let cost = storeItem.fbc_cost[0];
        if (STORE._storeData[itemCode] && !storeItem.i) {
            cost = storeItem.fbc_cost[STORE._storeData[itemCode].q];
        }
        getGLOBAL().CallJS("cc.fbcBuyItem", [itemCode, "fbcBuyItem"]);
        STORE._facebookPurchaseItemCode = itemCode;
        PLEASEWAIT.Show(getKEYS().Get("msg_openingfb"));
    }

    public static FacebookCreditPurchaseB(result: string): void {
        if (JSON.parse(result).success === 1) {
            STORE.BuyB(STORE._facebookPurchaseItemCode);
        }
        PLEASEWAIT.Hide();
    }

    public static ProcessPurchases(): void {
        try {
            getGLOBAL()._mapWidth = 1000;
            getGLOBAL()._mapHeight = 800;
            
            // Process ENL purchases for map size
            for (let i = 0; i < 2; i++) {
                let ENLobj: any = null;
                if (i && STORE._storeData.ENLI) {
                    ENLobj = STORE._storeData.ENLI;
                } else if (!i && STORE._storeData.ENL) {
                    ENLobj = STORE._storeData.ENL;
                }
                
                if (ENLobj) {
                    for (let enl = 0; enl < ENLobj.q; enl++) {
                        getGLOBAL()._mapWidth *= 1.1;
                        getGLOBAL()._mapHeight *= 1.1;
                    }
                    getGLOBAL()._mapWidth = Math.ceil(getGLOBAL()._mapWidth / 20) * 20;
                    getGLOBAL()._mapHeight = Math.ceil(getGLOBAL()._mapHeight / 20) * 20;
                }
            }
            
            // Process hatchery overdrive
            getGLOBAL()._hatcheryOverdrive = 0;
            STORE.cleanupExpiredPurchase("HOD");
            STORE.cleanupExpiredPurchase("HOD2");
            STORE.cleanupExpiredPurchase("HOD3");
            STORE.cleanupExpiredPurchase("HODI");
            STORE.cleanupExpiredPurchase("HOD2I");
            STORE.cleanupExpiredPurchase("HOD3I");
            
            getGLOBAL()._hatcheryOverdrivePower.Set(0);
            if (STORE._storeData.HOD3) {
                getGLOBAL()._hatcheryOverdrive = STORE._storeData.HOD3.e - getGLOBAL().Timestamp();
                getGLOBAL()._hatcheryOverdrivePower.Set(10);
            } else if (STORE._storeData.HOD2) {
                getGLOBAL()._hatcheryOverdrive = STORE._storeData.HOD2.e - getGLOBAL().Timestamp();
                getGLOBAL()._hatcheryOverdrivePower.Set(6);
            } else if (STORE._storeData.HOD) {
                getGLOBAL()._hatcheryOverdrive = STORE._storeData.HOD.e - getGLOBAL().Timestamp();
                getGLOBAL()._hatcheryOverdrivePower.Set(4);
            }
            
            // Process other overdrives
            getGLOBAL()._harvesterOverdrive = 0;
            getGLOBAL()._harvesterOverdrivePower.Set(0);
            if (STORE._storeData.POD && STORE._storeData.POD.e > getGLOBAL().Timestamp()) {
                getGLOBAL()._harvesterOverdrive = STORE._storeData.POD.e;
                getGLOBAL()._harvesterOverdrivePower.Set(2);
            }
            
            // Tower overdrive
            getGLOBAL()._towerOverdrive = new SecNum(0);
            STORE.cleanupExpiredPurchase("TOD");
            STORE.cleanupExpiredPurchase("TODI");
            if (STORE._storeData.TOD) {
                getGLOBAL()._towerOverdrive.Set(STORE._storeData.TOD.e);
            }
            if (STORE._storeData.TODI) {
                getGLOBAL()._towerOverdrive.Set(STORE._storeData.TODI.e);
            }
            
            // Monster overdrive
            getGLOBAL()._monsterOverdrive.Set(0);
            STORE.cleanupExpiredPurchase("MOD");
            if (STORE._storeData.MOD) {
                getGLOBAL()._monsterOverdrive.Set(STORE._storeData.MOD.e);
            }
            
            // Build time reduction
            getGLOBAL()._buildTime = 1;
            STORE.cleanupExpiredPurchase("BST");
            if (STORE._storeData.BST) {
                getGLOBAL()._buildTime -= 0.2;
            }
            
            // Upgrade packing bonus
            getGLOBAL()._upgradePacking = 1;
            if (STORE._storeData.BIP) {
                getGLOBAL()._upgradePacking += 0.1 * STORE._storeData.BIP.q;
            }
            getGLOBAL()._upgradePacking = Math.floor(getGLOBAL()._upgradePacking * 100) / 100;
            
            STORE.Update();
        } catch (e) {
            getLOGGER().Log("err", "Store.ProcessPurchases: " + e.message);
        }
    }

    private static cleanupExpiredPurchase(code: string): void {
        if (STORE._storeData[code] && STORE._storeData[code].e < getGLOBAL().Timestamp()) {
            delete STORE._storeData[code];
        }
    }

    public static CheckUpgrade(code: string): any {
        return STORE._storeData[code];
    }

    public static updateCredits(result: string): void {
        getPOPUPS().Next();
        const data = JSON.parse(result);
        if (data.error === 0) {
            if (getLOGIN().checkHash(result)) {
                getBASE()._credits.Set(data.credits);
                getBASE()._hpCredits = data.credits;
                getGLOBAL()._credits.Set(data.credits);
            } else {
                getLOGGER().Log("err", "STORE.updateCredits " + result);
            }
        } else {
            getGLOBAL().ErrorMessage(data.error, getGLOBAL().ERROR_ORANGE_BOX_ONLY);
        }
    }

    public static ZazzleAdd(): void {
        STORE.ZazzleClear();
        STORE._zazzleMC = new MovieClip();
        STORE._mc.window.addChild(STORE._zazzleMC);
        const img = "popups/ZAZZLE_AD.v2.jpg";
        ImageCache.GetImageWithCallBack(img, (url: string, bmd: BitmapData): void => {
            if (STORE._zazzleMC.numChildren) {
                while (STORE._zazzleMC.numChildren > 0) {
                    STORE._zazzleMC.removeChildAt(0);
                }
            }
            const bitmap = new Bitmap(bmd);
            bitmap.x = (670 - bitmap.width) / 2;
            bitmap.y = (390 - bitmap.height) / 2;
            STORE._zazzleMC.addChild(bitmap);
            STORE._zazzleMC.buttonMode = true;
            STORE._zazzleMC.useHandCursor = true;
            STORE._zazzleMC.addEventListener(MouseEvent.CLICK, STORE.ZazzleClick);
        });
    }

    public static ZazzleClear(): void {
        if (STORE._zazzleMC && STORE._zazzleMC.parent) {
            STORE._zazzleMC.parent.removeChild(STORE._zazzleMC);
            STORE._zazzleMC = null;
        }
    }

    public static ZazzleClick(e: Event = null): void {
        getGLOBAL().gotoURL("http://www.zazzle.com/backyardmonsters/", null, true, [63, 1]);
    }
}
