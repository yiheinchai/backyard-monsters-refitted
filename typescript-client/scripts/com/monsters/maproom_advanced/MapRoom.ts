import BitmapData from "openfl/display/BitmapData";
import DisplayObjectContainer from "openfl/display/DisplayObjectContainer";
import Sprite from "openfl/display/Sprite";
import StageDisplayState from "openfl/display/StageDisplayState";
import Event from "openfl/events/Event";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import MouseEvent from "openfl/events/MouseEvent";
import TimerEvent from "openfl/events/TimerEvent";
import Point from "openfl/geom/Point";
import Timer from "openfl/utils/Timer";

import { SecNum } from "../../../cc/utils/SecNum";
import { ALLIANCES } from "../alliances/ALLIANCES";
import { Chat } from "../chat/Chat";
import { Smoke } from "../effects/smoke/Smoke";
import { EnumYardType } from "../enums/EnumYardType";
import { FriendPicker } from "../mailbox/FriendPicker";
import { MailBox } from "../mailbox/MailBox";
import { Thread } from "../mailbox/Thread";
import { IMapRoom } from "../maproom_manager/IMapRoom";
import { IMapRoomCell } from "../maproom_manager/IMapRoomCell";
import { MapRoomManager } from "../maproom_manager/MapRoomManager";
import { UI_BOTTOM } from "../ui/UI_BOTTOM";
import { MapRoomCell } from "./MapRoomCell";
import { MapRoomPopup } from "./MapRoomPopup";
import { PopupRelocateMe } from "./PopupRelocateMe";
import { bubble_acceptInvite } from "./bubble_acceptInvite";
import { bubble_selecttarget } from "./bubble_selecttarget";
import { objZone } from "./objZone";
import { URLLoaderApi } from "../../../URLLoaderApi";

import { BASE } from "../../../BASE";
import { CREATURES } from "../../../CREATURES";
import { GLOBAL } from "../../../GLOBAL";
import { JSON } from "../../../JSON";
import { KEYS } from "../../../KEYS";
import { LOGGER } from "../../../LOGGER";
import { MAILBOX } from "../../../MAILBOX";
import { PLEASEWAIT } from "../../../PLEASEWAIT";
import { POPUPS } from "../../../POPUPS";
import { SOUNDS } from "../../../SOUNDS";
import { Tutorial } from "./Tutorial";
import { UI2 } from "../../../UI2";

/**
 * MapRoom - Main map room controller class (implements IMapRoom).
 */
export class MapRoom implements IMapRoom {
    public static _homePoint: Point;
    private static _zoneWidth: number = 10;
    private static _zoneHeight: number = 10;
    public static _mapWidth: number = 100;
    public static _mapHeight: number = 100;
    public static _mc: MapRoomPopup | null = null;
    public static _bookmarks: Array<any> = [];
    public static _currentPosition: Point;
    public static _open: boolean = false;
    public static _monsterTransferInProgress: boolean = false;
    public static _resourceTransferInProgress: boolean = false;
    public static _homeCell: MapRoomCell | null = null;
    private static _resourceTransfer: any = {};
    public static _monsterTransfer: any = {};
    public static _pendingTransferRequest: boolean = false;
    private static _bookmarkData: any = {};
    private static _saveErrors: number = 0;
    private static _zones: any = {};
    private static _bubbleSelectTarget: bubble_selecttarget;
    private static _monsterSource: MapRoomCell | null = null;
    private static _monsterSourceRef: MapRoomCell | null = null;
    private static _monsterTargetRef: MapRoomCell | null = null;
    private static _requestedZones: Array<any>;
    private static _showEnemyWait: boolean = false;
    private static _resourceCounter: number = 0;
    private static _monstersTransferred: number = 0;
    private static _allMonstersTransferred: boolean = false;
    public static _flingerInRange: boolean = false;
    private static _worldID: number = 0;
    public static _inviteBaseID: number = 0;
    public static _inviteLocation: Point = new Point();
    public static _viewOnly: boolean = false;
    private static _bubbleAcceptInvite: bubble_acceptInvite | null = null;
    private static _migrateThread: Thread | null = null;
    private static _reposition: boolean = false;
    private static _popupRelocateMe: PopupRelocateMe | null = null;
    private static _empiredestroyed: boolean = false;
    private static _showAttackWait: boolean = false;
    private static _pendingMapCellDataRequests: Array<any> = [];
    private static _priorityMapCellsToRequest: Array<any> = [];
    public static _smokeBMD: BitmapData | null = null;
    public static _smokeParticles: Array<any> | null = null;
    public static _frame: number = 0;
    public static BRIDGE: any; // Bridge object for cross-context communication

    constructor() { super(); }

    public static get homeCell(): IMapRoomCell | null { return MapRoom._homeCell; }
    public static set migrateThread(value: Thread) { MapRoom._migrateThread = value; }
    public static set inviteBaseID(value: number) { MapRoom._inviteBaseID = value; }
    public static set showAttackWait(value: boolean) { MapRoom._showAttackWait = value; }
    public static set showEnemyWait(value: boolean) { MapRoom._showEnemyWait = value; }
    public static set empireDestroyed(value: boolean) { MapRoom._empiredestroyed = value; }

    public static _Setup(homePoint: Point, worldID: number = 0, inviteBaseID: number = 0, viewOnly: boolean = false, migrateThread: Thread | null = null): void {
        MapRoom._homePoint = homePoint;
        MapRoom._worldID = worldID;
        MapRoom._inviteBaseID = inviteBaseID;
        MapRoom._viewOnly = viewOnly;
        if (MapRoom._viewOnly) {
            MapRoom._inviteLocation = new Point(homePoint.x, homePoint.y);
            if (migrateThread) MapRoom._migrateThread = migrateThread;
        } else {
            MapRoom._migrateThread = migrateThread;
        }
        MapRoom._bubbleSelectTarget = new bubble_selecttarget();
        MapRoom._bubbleSelectTarget.tDesc.htmlText = "<b>" + KEYS.Get("bubble_selecttarget_desc") + "</b>";
        MapRoom._bubbleSelectTarget.bCancel.SetupKey("btn_cancel");
        MapRoom._bubbleSelectTarget.bCancel.addEventListener(MouseEvent.CLICK, MapRoom.TransferCancel);
        MapRoom._bubbleSelectTarget.x = 270;
        MapRoom._bubbleSelectTarget.y = 415;
        MapRoom._saveErrors = 0;
        MapRoom._showEnemyWait = false;
        MapRoom._showAttackWait = false;
        MapRoom._requestedZones = [];
        FriendPicker.ClearContacts();
    }

    public static HideFromViewOnly(): void {
        if (MapRoom._open && GLOBAL.mode !== GLOBAL.e_BASE_MODE.ATTACK && GLOBAL.mode !== GLOBAL.e_BASE_MODE.WMATTACK) {
            SOUNDS.Play("close");
            MapRoom._worldID = 0;
            MapRoom._inviteBaseID = 0;
            MapRoom._viewOnly = false;
            GLOBAL._currentCell = null;
            MapRoom._Setup(GLOBAL._mapHome);
            if (MapRoom._mc!.parent) MapRoom._mc!.parent.removeChild(MapRoom._mc!);
            MapRoom.ClearCells();
            MapRoom._mc!.Cleanup();
            MapRoom._mc = null;
        }
        MapRoom._open = false;
    }

    public static ClearCells(): void { MapRoom._zones = {}; }

    public static JumpTo(point: Point): void { if (MapRoom._mc!.parent) MapRoom._mc!.JumpTo(point); }

    public static SetPendingInvitation(): void { MapRoom._mc!._popupInfoMine.PendingInvite(); }

    public static PreAcceptInvitation(container: DisplayObjectContainer): void {
        if (ALLIANCES._myAlliance) { GLOBAL.Message(KEYS.Get("msg_mustleavealliance")); return; }
        MapRoom._popupRelocateMe = new PopupRelocateMe();
        MapRoom._popupRelocateMe.Setup(null, "invite");
        if (container) { GLOBAL.BlockerAdd(container as Sprite); container.addChild(MapRoom._popupRelocateMe); }
    }

    public static AcceptInvitation(useShiny: boolean = false): void {
        if (ALLIANCES._myAlliance) { GLOBAL.Message(KEYS.Get("msg_mustleavealliance")); return; }
        if (Boolean(MapRoom._migrateThread) && MapRoom._inviteBaseID !== 0) {
            const handleAcceptSuccessful = (serverData: any): void => {
                PLEASEWAIT.Hide();
                if (serverData.error === 0) {
                    if (serverData.cantMoveTill) {
                        if (MapRoom._open) { GLOBAL.Message(KEYS.Get("movebase_warning", { "v1": GLOBAL.ToTime(serverData.cantMoveTill - serverData.currenttime) }), KEYS.Get("btn_returnhome"), MapRoom.ReturnFromFailedInvite); }
                        else { GLOBAL.Message(KEYS.Get("movebase_warning", { "v1": GLOBAL.ToTime(serverData.cantMoveTill - serverData.currenttime) })); GLOBAL.BlockerRemove(); }
                    } else {
                        if (serverData.coords && serverData.coords.length === 2 && serverData.coords[0] > -1 && serverData.coords[1] > -1) {
                            GLOBAL._mapHome = new Point(serverData.coords[0], serverData.coords[1]);
                            MapRoom._Setup(GLOBAL._mapHome);
                        }
                        MapRoomManager.instance.BookmarksClear();
                        BASE._loadedFriendlyBaseID = 0;
                        GLOBAL._homeBaseID = 0;
                        GLOBAL._currentCell = null;
                        GLOBAL._mapOutpost = [];
                        if (MapRoom._open) MapRoomManager.instance.Hide();
                        MapRoom.ClearCells();
                        MapRoom._Setup(GLOBAL._mapHome);
                        MapRoom._reposition = true;
                        GLOBAL._showMapWaiting = 1;
                    }
                } else { GLOBAL.Message(serverData.error); }
            };
            const handleAcceptError = (event: IOErrorEvent): void => { LOGGER.Log("err", "MapRoom.AcceptInvitation HTTP"); };
            const url = GLOBAL._baseURL + "migratetofriend";
            const loadvars: Array<any> = [["baseid", MapRoom._inviteBaseID], ["threadid", MapRoom._migrateThread!.data.threadid]];
            const SHINYCOST = new SecNum(1200);
            const RESOURCECOST = new SecNum(10000000);
            if (MapRoom._popupRelocateMe) { MapRoom._popupRelocateMe.Cleanup(); MapRoom._popupRelocateMe.Hide(); MapRoom._popupRelocateMe = null; }
            if (useShiny) {
                if (GLOBAL._credits.Get() < SHINYCOST.Get()) { POPUPS.DisplayGetShiny(); return; }
                loadvars.push(["shiny", SHINYCOST.Get()]);
            } else {
                if (GLOBAL._resources.r1.Get() < RESOURCECOST.Get() || GLOBAL._resources.r2.Get() < RESOURCECOST.Get() || GLOBAL._resources.r3.Get() < RESOURCECOST.Get() || GLOBAL._resources.r4.Get() < RESOURCECOST.Get()) { GLOBAL.Message(KEYS.Get("map_rel_res")); return; }
                loadvars.push(["resources", JSON.encode({ "r1": RESOURCECOST.Get(), "r2": RESOURCECOST.Get(), "r3": RESOURCECOST.Get(), "r4": RESOURCECOST.Get() })]);
            }
            PLEASEWAIT.Show(KEYS.Get("wait_movebase"));
            MailBox.Hide();
            if (MapRoom._migrateThread!.parent) { if (MapRoom._migrateThread!.numChildren > 0) MapRoom._migrateThread!.removeChildAt(1); MapRoom._migrateThread!.parent.removeChild(MapRoom._migrateThread!); }
            new URLLoaderApi().load(url, loadvars, handleAcceptSuccessful, handleAcceptError);
        }
    }

    public static ReturnFromFailedInvite(): void { MapRoomManager.instance.Hide(); BASE.Load(); }

    public static RejectInvitation(event: MouseEvent | null = null): void {
        if (Boolean(MapRoom._migrateThread) && MapRoom._inviteBaseID !== 0) {
            const handleRejectSuccessful = (serverData: any): void => {
                PLEASEWAIT.Hide();
                if (serverData.error === 0) {
                    GLOBAL._currentCell = null;
                    if (MapRoom._open) { MapRoomManager.instance.Hide(); MapRoom.ClearCells(); MapRoom._Setup(GLOBAL._mapHome); BASE.LoadBase(null, 0, GLOBAL._homeBaseID, GLOBAL.e_BASE_MODE.BUILD, false, EnumYardType.MAIN_YARD); }
                    else { MAILBOX.Show(); }
                } else { LOGGER.Log("err", "MapRoom.RejectInvitation", serverData.error); }
            };
            const handleRejectError = (event: IOErrorEvent): void => { LOGGER.Log("err", "MapRoom.RejectInvitation HTTP"); };
            PLEASEWAIT.Show(KEYS.Get("wait_rejecting"));
            const url = GLOBAL._baseURL + "rejectmigratetofriend";
            const loadvars: Array<any> = [["baseid", MapRoom._inviteBaseID], ["threadid", MapRoom._migrateThread!.data.threadid]];
            if (MapRoom._migrateThread!.parent) { if (MapRoom._migrateThread!.numChildren > 0) MapRoom._migrateThread!.removeChildAt(1); MapRoom._migrateThread!.data.Changed(); MapRoom._migrateThread!.parent.removeChild(MapRoom._migrateThread!); MapRoom._migrateThread = null; MAILBOX.Hide(); }
            new URLLoaderApi().load(url, loadvars, handleRejectSuccessful, handleRejectError);
        }
    }

    public static BookmarkDataGet(key: string): number { return MapRoom._bookmarkData[key] ? Math.floor(MapRoom._bookmarkData[key]) : 0; }
    public static BookmarkDataSet(key: string, value: number, save: boolean = true): void {
        if (!MapRoom._bookmarkData) MapRoom._bookmarkData = {};
        let changed = false;
        if (value === 0 && Boolean(MapRoom._bookmarkData[key])) { delete MapRoom._bookmarkData[key]; if (save) MapRoom.BookmarksSave(); changed = true; }
        else if (!MapRoom._bookmarkData[key]) { MapRoom._bookmarkData[key] = value; if (save) MapRoom.BookmarksSave(); changed = true; }
        else if (MapRoom._bookmarkData[key] !== value) { MapRoom._bookmarkData[key] = value; if (save) MapRoom.BookmarksSave(); changed = true; }
    }
    public static BookmarkDataGetStr(key: string): string { return MapRoom._bookmarkData[key] ? String(MapRoom._bookmarkData[key]) : ""; }
    public static BookmarkDataSetStr(key: string, value: string, save: boolean = true): void {
        if (!MapRoom._bookmarkData) MapRoom._bookmarkData = {};
        let changed = false;
        if (value.length === 0 && Boolean(MapRoom._bookmarkData[key])) { delete MapRoom._bookmarkData[key]; if (save) MapRoom.BookmarksSave(); changed = true; }
        else if (!MapRoom._bookmarkData[key]) { MapRoom._bookmarkData[key] = value; if (save) MapRoom.BookmarksSave(); changed = true; }
        else if (MapRoom._bookmarkData[key] !== value) { MapRoom._bookmarkData[key] = value; if (save) MapRoom.BookmarksSave(); changed = true; }
    }

    public static BookmarksSave(): void {
        const handleBMSaveSuccessful = (serverData: any): void => { if (serverData.error !== 0) LOGGER.Log("err", "MapRoom.BookmarksSave", serverData.error); };
        const handleBMSaveError = (event: IOErrorEvent): void => { LOGGER.Log("err", "MapRoom.BookmarksSave HTTP"); };
        const url = GLOBAL._apiURL + "player/savebookmarks";
        const loadvars: Array<any> = [["bookmarks", JSON.encode(MapRoom._bookmarkData)]];
        new URLLoaderApi().load(url, loadvars, handleBMSaveSuccessful, handleBMSaveError);
    }

    public static AddBookmark(name: string, save: boolean = true): any {
        name = name.replace(/^\s+|\s+$/g, "");
        if (name.length === 0) return { "hide": false, "message": KEYS.Get("newmap_bm_name") };
        if (name.length > 20) return { "hide": false, "message": KEYS.Get("newmap_bm_long") };
        if (MapRoom._currentPosition.x < 0 || MapRoom._currentPosition.x >= MapRoom._mapWidth || MapRoom._currentPosition.y < 0 || MapRoom._currentPosition.y >= MapRoom._mapHeight) return { "hide": true, "message": "ERROR: Bookmark point is not on the map." };
        if (MapRoom._bookmarks.length >= 8) return { "hide": true, "message": KEYS.Get("newmap_bm_full") };
        const len = MapRoom._bookmarks.length;
        for (let i = 0; i < len; i++) { if (MapRoom._bookmarks[i].location.x === MapRoom._currentPosition.x && MapRoom._bookmarks[i].location.y === MapRoom._currentPosition.y) return { "hide": true, "message": KEYS.Get("newmap_bm_done") }; }
        if (save) { MapRoom.BookmarkDataSet("mbm" + len, MapRoom._currentPosition.x * 10000 + MapRoom._currentPosition.y, false); MapRoom.BookmarkDataSetStr("mbmn" + len, name, false); MapRoom.BookmarkDataSet("mbms", len + 1); }
        MapRoom._bookmarks.push({ "name": name, "location": MapRoom._currentPosition });
        return { "hide": true, "message": "SUCCESS" };
    }

    private static RequestData(zonePoint: Point, force: boolean = false): void {
        const zoneID = zonePoint.x * 10000 + zonePoint.y;
        const getAreaURL = GLOBAL._mapURL + "getarea";
        let getResources = 0;
        let requestRetryTimer: Timer | null = null;
        if (force || GLOBAL.Timestamp() > MapRoom._resourceCounter + 20) { getResources = 1; MapRoom._resourceCounter = GLOBAL.Timestamp(); force = true; }
        let z: objZone;
        if (MapRoom._zones[zoneID]) { z = MapRoom._zones[zoneID]; }
        else { z = new objZone(); MapRoom._zones[zoneID] = z; }

        const handleLoadSuccessful = (serverData: any): void => {
            MapRoom._pendingMapCellDataRequests.shift();
            if (MapRoom._pendingMapCellDataRequests.length > 0) trySendRequest();
            if (!MapRoom._open && !BASE._needCurrentCell) return;
            if (serverData && !serverData.error && Boolean(serverData.data)) {
                const zId = serverData.x * 10000 + serverData.y;
                if (!MapRoom._zones[zId]) MapRoom._zones[zId] = new objZone();
                MapRoom._zones[zId].data = serverData.data;
                if (serverData.resources) { for (let i = 1; i < 5; i++) { GLOBAL._resources["r" + i].Set(serverData.resources["r" + i]); GLOBAL._hpResources["r" + i] = GLOBAL._resources["r" + i].Get(); GLOBAL._resources["r" + i + "max"] = serverData.resources["r" + i + "max"]; GLOBAL._hpResources["r" + i + "max"] = serverData.resources["r" + i + "max"]; } }
                if (serverData.alliancedata) ALLIANCES.ProcessAlliances(serverData.alliancedata);
                if (MapRoom._open) MapRoom._mc!.Update(true);
                else if (BASE._needCurrentCell) { if (MapRoom._zones && MapRoom._zones[zId] && Boolean(MapRoom._zones[zId].data) && Boolean(MapRoom._zones[zId].data[BASE._currentCellLoc.x])) { const cell = MapRoom._zones[zId].data[BASE._currentCellLoc.x][BASE._currentCellLoc.y]; GLOBAL._currentCell = new MapRoomCell(); (GLOBAL._currentCell as MapRoomCell).Setup(cell); (GLOBAL._currentCell as MapRoomCell).cellX = BASE._currentCellLoc.x; (GLOBAL._currentCell as MapRoomCell).cellY = BASE._currentCellLoc.y; MapRoom._zones = {}; } }
            } else if (Boolean(serverData) && !serverData.data) { LOGGER.Log("err", "MapRoom.Data NO DATA"); }
            else { LOGGER.Log("err", "MapRoom.Data", serverData.error); }
        };
        const handleLoadError = (event: IOErrorEvent): void => { ++MapRoom._saveErrors; if (MapRoom._saveErrors >= 3) { LOGGER.Log("err", "MapRoom.RequestData HTTP"); GLOBAL.ErrorMessage("WorldMapRoom.RequestData HTTP"); } };
        const trySendRequest = (): void => {
            while (MapRoom._priorityMapCellsToRequest.length > 0) { const point = MapRoom._priorityMapCellsToRequest[0]; const pendingIndex = MapRoom.GetPendingZoneRequestIndex(point.x, point.y); if (pendingIndex === -1) { addRequestToQueue(point, 0, true); } else if (pendingIndex > 0) { const pendingRequest = MapRoom._pendingMapCellDataRequests[pendingIndex].loadvars; MapRoom._pendingMapCellDataRequests.splice(pendingIndex, 1); addRequestToQueue(point, pendingRequest[4][1], true); } MapRoom._priorityMapCellsToRequest.shift(); }
            const getCellData = MapRoom._pendingMapCellDataRequests[0];
            if (!MapRoom.ZoneHasPendingTransferRequest(getCellData.loadvars[0][1] * 10000 + getCellData.loadvars[1][1])) { if (requestRetryTimer) { requestRetryTimer.stop(); requestRetryTimer = null; } new URLLoaderApi().load(getCellData.url, getCellData.loadvars, handleLoadSuccessful, handleLoadError); }
            else { if (!requestRetryTimer) { requestRetryTimer = new Timer(200, 1); requestRetryTimer.addEventListener(TimerEvent.TIMER, trySendRequest as any); } requestRetryTimer.reset(); requestRetryTimer.start(); }
        };
        const addRequestToQueue = (point: Point, resources: number, addToFront: boolean = false): void => {
            const loadvars: Array<any> = [["x", Math.floor(point.x)], ["y", Math.floor(point.y)], ["width", MapRoom._zoneWidth], ["height", MapRoom._zoneHeight], ["sendresources", resources]];
            if (MapRoom._viewOnly) loadvars.push(["worldid", MapRoom._worldID]);
            const dataRequest = { "url": getAreaURL, "loadvars": loadvars };
            if (addToFront) MapRoom._pendingMapCellDataRequests.unshift(dataRequest);
            else MapRoom._pendingMapCellDataRequests.push(dataRequest);
        };

        if (force || GLOBAL.Timestamp() - z.updated > 30) {
            z.updated = GLOBAL.Timestamp() + Math.floor(Math.random() * 10);
            MapRoom._saveErrors = 0;
            addRequestToQueue(zonePoint, getResources);
            if (MapRoom._pendingMapCellDataRequests.length === 1) trySendRequest();
        }
    }

    public static GetCell(cellX: number, cellY: number, force: boolean = false): any {
        const zone = MapRoom.GetCellZone(cellX, cellY);
        MapRoom.RequestData(zone.point, force);
        if (MapRoom._zones && MapRoom._zones[zone.id] && Boolean(MapRoom._zones[zone.id].data) && Boolean(MapRoom._zones[zone.id].data[cellX])) return MapRoom._zones[zone.id].data[cellX][cellY];
        return null;
    }

    public static Update(): void { if (MapRoom._open && MapRoom._mc && Boolean(MapRoom._mc.parent)) MapRoom._mc.Update(true); }
    public static Cleanup(): void { }

    public static TransferMonstersA(cell: MapRoomCell, monsters: any): void {
        MapRoom._monsterTransfer = {};
        let hasMonsters = false;
        for (const monsterId in monsters) { MapRoom._monsterTransfer[monsterId] = new SecNum(monsters[monsterId].Get()); if (monsters[monsterId].Get() > 0) hasMonsters = true; }
        if (hasMonsters) {
            const foundCell = MapRoom.GetCell(cell.X, cell.Y);
            if (foundCell) { MapRoom._monsterSource = new MapRoomCell(); MapRoom._monsterSource.Setup(foundCell); MapRoom._monsterSource.Cleanup(); MapRoom._monsterSource.cellX = cell.X; MapRoom._monsterSource.cellY = cell.Y; MapRoom._monsterSourceRef = cell; }
            if (MapRoom._bubbleSelectTarget.parent) MapRoom._bubbleSelectTarget.parent.removeChild(MapRoom._bubbleSelectTarget);
            MapRoom._mc!.addChild(MapRoom._bubbleSelectTarget);
            MapRoom._monsterTransferInProgress = true;
        } else { MapRoom._monsterTransfer = {}; MapRoom._monsterTransferInProgress = false; }
    }

    public static TransferMonstersB(cell: MapRoomCell): void {
        if (MapRoom._monsterTransferInProgress) {
            if (cell._mine) {
                if (cell._baseID === MapRoom._monsterSource!._baseID) { if (MapRoom._bubbleSelectTarget.parent) MapRoom._bubbleSelectTarget.parent.removeChild(MapRoom._bubbleSelectTarget); MapRoom._mc!.ShowMonstersA(MapRoom._monsterSource!, true); return; }
                MapRoom._mc!.ShowMonstersB(MapRoom._monsterTransfer, cell);
            }
        }
    }

    public static TransferMonstersC(targetCell: MapRoomCell): string {
        const zoneSource = MapRoom.GetCellZone(MapRoom._monsterSource!.cellX, MapRoom._monsterSource!.cellY);
        MapRoom._monsterTargetRef = targetCell;
        const zoneTarget = MapRoom.GetCellZone(MapRoom._monsterTargetRef.cellX, MapRoom._monsterTargetRef.cellY);
        let addedToPriority = false;
        let transferRetryTimer: Timer | null = null;
        if (MapRoom._monsterTransferInProgress) {
            if (MapRoom._monsterTargetRef._mine && MapRoom._monsterSource!._mine) {
                PLEASEWAIT.Show(KEYS.Get("wait_processing"));
                MapRoom._mc!.HideMonstersB();
                if (MapRoom._monsterTargetRef._monsters && MapRoom._monsterSource && MapRoom._monsterTargetRef._monsterData.space.Get() > 0) {
                    const actualTransfer: any = {};
                    const finalMonsters: any = {};
                    const finalSrcMonsters: any = {};
                    let spaceRemaining = Math.floor(MapRoom._monsterTargetRef._monsterData.space.Get());
                    if (MapRoom._bubbleSelectTarget.parent) MapRoom._bubbleSelectTarget.parent.removeChild(MapRoom._bubbleSelectTarget);
                    MapRoom._monsterTransferInProgress = false;
                    for (const dst in MapRoom._monsterTargetRef._monsters) { finalMonsters[dst] = MapRoom._monsterTargetRef._monsters[dst].Get(); spaceRemaining -= MapRoom._monsterTargetRef._monsters[dst].Get() * CREATURES.GetProperty(dst, "cStorage"); }
                    for (const src in MapRoom._monsterSource!._monsters) { finalSrcMonsters[src] = MapRoom._monsterSource!._monsters[src].Get(); }
                    MapRoom._monstersTransferred = 0;
                    MapRoom._allMonstersTransferred = true;
                    for (const src in MapRoom._monsterTransfer) {
                        if (MapRoom._monsterTransfer[src].Get() > 0) {
                            const cost = CREATURES.GetProperty(src, "cStorage");
                            if (spaceRemaining >= MapRoom._monsterTransfer[src].Get() * cost) { actualTransfer[src] = MapRoom._monsterTransfer[src].Get(); MapRoom._monstersTransferred += MapRoom._monsterTransfer[src].Get(); }
                            else { MapRoom._allMonstersTransferred = false; actualTransfer[src] = Math.floor(spaceRemaining / cost); MapRoom._monstersTransferred += Math.floor(spaceRemaining / cost); }
                            if (MapRoom._monsterTargetRef._monsters[src]) finalMonsters[src] = MapRoom._monsterTargetRef._monsters[src].Get() + actualTransfer[src];
                            else finalMonsters[src] = actualTransfer[src];
                            if (MapRoom._monsterSource!._monsters[src]) finalSrcMonsters[src] = MapRoom._monsterSource!._monsters[src].Get() - actualTransfer[src];
                            spaceRemaining -= actualTransfer[src] * cost;
                            if (spaceRemaining <= 0) break;
                        }
                    }
                    const srcMonsterData = { "hcount": MapRoom._monsterSource!._hpMonsterData.hcount, "overdrivepower": MapRoom._monsterSource!._monsterData.overdrivepower.Get(), "hcc": MapRoom._monsterSource!._hpMonsterData.hcc, "space": MapRoom._monsterSource!._monsterData.space.Get(), "h": MapRoom._monsterSource!._hpMonsterData.h, "finishtime": MapRoom._monsterSource!._hpMonsterData.finishtime, "overdrivetime": MapRoom._monsterSource!._monsterData.overdrivetime.Get(), "housed": finalSrcMonsters, "hid": MapRoom._monsterSource!._hpMonsterData.hid, "hstage": MapRoom._monsterSource!._hpMonsterData.hstage, "saved": GLOBAL.Timestamp() };
                    const targetMonsterData = { "hcount": MapRoom._monsterTargetRef._hpMonsterData.hcount, "overdrivepower": MapRoom._monsterTargetRef._monsterData.overdrivepower.Get(), "hcc": MapRoom._monsterTargetRef._hpMonsterData.hcc, "space": MapRoom._monsterTargetRef._monsterData.space.Get(), "h": MapRoom._monsterTargetRef._hpMonsterData.h, "finishtime": MapRoom._monsterTargetRef._hpMonsterData.finishtime, "overdrivetime": MapRoom._monsterTargetRef._monsterData.overdrivetime.Get(), "housed": finalMonsters, "hid": MapRoom._monsterTargetRef._hpMonsterData.hid, "hstage": MapRoom._monsterTargetRef._hpMonsterData.hstage, "saved": GLOBAL.Timestamp() };
                    const transferVars: Array<any> = [["frombaseid", MapRoom._monsterSource!._baseID], ["tobaseid", MapRoom._monsterTargetRef._baseID], ["monsters", JSON.encode([srcMonsterData, targetMonsterData])]];

                    const transferSuccessful = (serverData: any): void => {
                        PLEASEWAIT.Hide();
                        if (serverData.error === 0) {
                            if (MapRoom._allMonstersTransferred) GLOBAL.Message(KEYS.Get("newmap_tr_done"));
                            else { GLOBAL.Message(KEYS.Get("newmap_tr_space", { "v1": MapRoom._monstersTransferred })); if (MapRoom._monstersTransferred === 0) { MapRoom._monsterTransfer = {}; MapRoom._pendingTransferRequest = false; return; } }
                            for (const dst in finalMonsters) { if (MapRoom._monsterTargetRef!._monsters[dst]) { MapRoom._monsterTargetRef!._monsters[dst].Set(finalMonsters[dst]); MapRoom._monsterTargetRef!._hpMonsters[dst] = finalMonsters[dst]; } else { MapRoom._monsterTargetRef!._monsters[dst] = new SecNum(finalMonsters[dst]); MapRoom._monsterTargetRef!._hpMonsters[dst] = finalMonsters[dst]; } }
                            if (MapRoom._monsterSourceRef!.cellX === MapRoom._monsterSource!.cellX && MapRoom._monsterSourceRef!.cellY === MapRoom._monsterSource!.cellY) { for (const src in finalSrcMonsters) { if (finalSrcMonsters[src] > 0) { MapRoom._monsterSourceRef!._monsters[src].Set(finalSrcMonsters[src]); MapRoom._monsterSourceRef!._hpMonsters[src] = finalSrcMonsters[src]; } else { delete MapRoom._monsterSourceRef!._monsters[src]; delete MapRoom._monsterSourceRef!._hpMonsters[src]; } } }
                            if (MapRoom._zones) { if (MapRoom._zones[zoneSource.id] && MapRoom._zones[zoneSource.id].data) MapRoom._zones[zoneSource.id].data[MapRoom._monsterSource!.cellX][MapRoom._monsterSource!.cellY].m.housed = finalSrcMonsters; else MapRoom._zones[zoneSource.id] = new objZone(); if (MapRoom._zones[zoneTarget.id] && MapRoom._zones[zoneTarget.id].data) MapRoom._zones[zoneTarget.id].data[MapRoom._monsterTargetRef!.cellX][MapRoom._monsterTargetRef!.cellY].m.housed = finalMonsters; else MapRoom._zones[zoneTarget.id] = new objZone(); }
                        } else { GLOBAL.Message(KEYS.Get("msg_err_transfer") + serverData.error); }
                        MapRoom._monsterTransfer = {};
                        MapRoom._pendingTransferRequest = false;
                    };
                    const transferError = (event: IOErrorEvent): void => { PLEASEWAIT.Hide(); GLOBAL.Message(KEYS.Get("msg_err_transfer") + event.text); MapRoom._monsterTransfer = {}; MapRoom._pendingTransferRequest = false; };
                    const trySendTransfer = (): void => {
                        const sourcePendingZoneIdx = MapRoom.GetPendingZoneRequestIndex(MapRoom._monsterSource!.cellX, MapRoom._monsterSource!.cellY);
                        const targetPendingZoneIdx = zoneSource.id === zoneTarget.id ? sourcePendingZoneIdx : MapRoom.GetPendingZoneRequestIndex(MapRoom._monsterTargetRef!.cellX, MapRoom._monsterTargetRef!.cellY);
                        if (sourcePendingZoneIdx === -1 && targetPendingZoneIdx === -1) { if (transferRetryTimer) { transferRetryTimer.stop(); transferRetryTimer = null; } MapRoom._pendingTransferRequest = true; new URLLoaderApi().load(GLOBAL._mapURL + "transferassets", transferVars, transferSuccessful, transferError); }
                        else { if (!transferRetryTimer) { transferRetryTimer = new Timer(200, 1); transferRetryTimer.addEventListener(TimerEvent.TIMER, trySendTransfer as any); } transferRetryTimer.reset(); transferRetryTimer.start(); if (!addedToPriority) { if (sourcePendingZoneIdx > 0) MapRoom._priorityMapCellsToRequest.push(zoneSource.point); if (targetPendingZoneIdx > 0 && zoneSource.id !== zoneTarget.id) MapRoom._priorityMapCellsToRequest.push(zoneTarget.point); addedToPriority = true; } }
                    };
                    trySendTransfer();
                    return "";
                }
                if (MapRoom._monsterTargetRef._monsterData.space.Get() === 0) GLOBAL.Message(KEYS.Get("newmap_tr_err1"));
                PLEASEWAIT.Hide();
                return KEYS.Get("newmap_tr_err1");
            }
            GLOBAL.Message(KEYS.Get("newmap_tr_err2"));
            PLEASEWAIT.Hide();
            return KEYS.Get("newmap_tr_err2");
        }
        PLEASEWAIT.Hide();
        return KEYS.Get("newmap_tr_err3");
    }

    public static TransferCancel(event: MouseEvent | null = null): void { if (MapRoom._bubbleSelectTarget.parent) MapRoom._bubbleSelectTarget.parent.removeChild(MapRoom._bubbleSelectTarget); MapRoom._resourceTransfer = {}; MapRoom._monsterTransfer = {}; MapRoom._resourceTransferInProgress = false; MapRoom._monsterTransferInProgress = false; MapRoom._pendingTransferRequest = false; }

    public static Resize(): void { MapRoom._mc!.x = 0; MapRoom._mc!.y = 0; MapRoomManager.instance.ResizeHandler(); }

    public static SmokeAdd(): void { if (MapRoom._smokeBMD) return; MapRoom.SmokeRemove(); MapRoom._smokeBMD = new BitmapData(100, 100, true, 16777215); MapRoom._smokeParticles = []; }
    public static SmokeRemove(): void { MapRoom._smokeBMD = null; }
    public static SmokeTick(event: Event | null = null): void {
        if (!MapRoom._smokeBMD) return;
        MapRoom._frame += 1;
        if (MapRoom._frame === 1000) MapRoom._frame = 0;
        if (MapRoom._frame % 2 === 0) {
            if (MapRoom._smokeParticles!.length < 200) MapRoom._smokeParticles!.push({ "position": new Point(2 + Math.random() * 15, 90), "speed": 3 + Math.random(), "wind": 0.6 + Math.random() * 0.4 });
            MapRoom._smokeBMD.fillRect(MapRoom._smokeBMD.rect, 16777215);
            for (let i = 0; i < MapRoom._smokeParticles!.length; i++) {
                const p = MapRoom._smokeParticles![i];
                p.position.x += p.wind * 0.4;
                p.position.y -= p.speed * 0.2;
                if (p.speed > 0.1) p.speed -= 0.02;
                let alpha = Math.floor(100 - 100 / 4 * p.speed);
                if (alpha < 60) alpha = 60;
                const bmd = Smoke._smokeParticleBMD[alpha];
                MapRoom._smokeBMD.copyPixels(bmd, bmd.rect, p.position, null, null, true);
                if (alpha >= 95) MapRoom._smokeParticles![i] = { "position": new Point(2 + Math.random() * 15, 90), "speed": 3 + Math.random(), "wind": 0.6 + Math.random() * 0.5 };
            }
        }
    }

    public static GetPendingZoneRequestIndex(cellX: number, cellY: number): number {
        if (MapRoom._pendingMapCellDataRequests.length === 0) return -1;
        let idx = -1;
        const cellZone = MapRoom.GetCellZone(cellX, cellY);
        for (const req of MapRoom._pendingMapCellDataRequests) { idx += 1; if (req.loadvars) { const reqX = Math.floor(req.loadvars[0][1]); const reqY = Math.floor(req.loadvars[1][1]); const reqZoneID = reqX * 10000 + reqY; if (reqZoneID === cellZone.id) return idx; } }
        return -1;
    }

    public static ZoneHasPendingTransferRequest(zoneId: number): boolean {
        if (!MapRoom._pendingTransferRequest) return false;
        let sourceZoneId = 0;
        let targetZoneId = 0;
        if (MapRoom._monsterSource) sourceZoneId = MapRoom.GetCellZone(MapRoom._monsterSource.cellX, MapRoom._monsterSource.cellY).id;
        if (MapRoom._monsterTargetRef) targetZoneId = MapRoom.GetCellZone(MapRoom._monsterTargetRef.cellX, MapRoom._monsterTargetRef.cellY).id;
        return (zoneId === sourceZoneId || zoneId === targetZoneId);
    }

    public static GetCellZone(cellX: number, cellY: number): any { const zonePoint = new Point(Math.floor(cellX / MapRoom._zoneWidth) * MapRoom._zoneWidth, Math.floor(cellY / MapRoom._zoneHeight) * MapRoom._zoneHeight); const zoneId = zonePoint.x * 10000 + zonePoint.y; return { point: zonePoint, id: zoneId }; }

    public static ShowInfoEnemy(cell: IMapRoomCell, inRange: boolean = false): void { MapRoom._mc!.ShowInfoEnemy(cell as MapRoomCell, inRange); }
    public static HideInfoMine(): void { MapRoom._mc!.HideInfoMine(); }

    // Instance properties/methods
    public set bookmarkData(value: any) { MapRoom._bookmarkData = value; }
    public set mapWidth(value: number) { MapRoom._mapWidth = value; }
    public set mapHeight(value: number) { MapRoom._mapHeight = value; }
    public get worldID(): number { return MapRoom._worldID; }
    public set worldID(value: number) { MapRoom._worldID = value; }
    public get isOpen(): boolean { return MapRoom._open; }
    public get flingerInRange(): boolean { return MapRoom._flingerInRange; }
    public get viewOnly(): boolean { return MapRoom._viewOnly; }
    public get playerOwnedCells(): Array<IMapRoomCell> | null { return null; }
    public get allianceDataById(): Map<string, any> | null { return null; }

    public Setup(): void { MapRoom._Setup(GLOBAL._mapHome, this.worldID, MapRoom._inviteBaseID, this.viewOnly); }
    public ReadyToShow(): boolean { return true; }
    public ShowDelayed(force: boolean = false): void {
        if (GLOBAL.mode === GLOBAL.e_BASE_MODE.BUILD) GLOBAL.m_mapRoomFunctional = true;
        if (force || MapRoom._reposition || ((!BASE.isMainYard || GLOBAL._bMap && GLOBAL._bMap._canFunction || GLOBAL.mode !== GLOBAL.e_BASE_MODE.BUILD) && (GLOBAL.mode === GLOBAL.e_BASE_MODE.HELP || !MapRoom._open))) {
            SOUNDS.Play("click1");
            MapRoom._open = true;
            MapRoom._reposition = false;
            if (MapRoom._mc !== null) { MapRoom._mc.Cleanup(); MapRoom._mc = null; }
            MapRoom._mc = new MapRoomPopup();
            MapRoom._mc.Setup();
            BASE.Cleanup();
            GLOBAL._layerUI.addChild(MapRoom._mc);
            UI2.SetupHUD();
            if (GLOBAL._currentCell) { MapRoom.GetCell(GLOBAL._currentCell.cellX, GLOBAL._currentCell.cellY, true); MapRoom._mc.JumpTo(new Point(GLOBAL._currentCell.cellX, GLOBAL._currentCell.cellY)); if (MapRoom._showEnemyWait) { MapRoom._mc.ShowInfoEnemy(GLOBAL._currentCell as MapRoomCell, true); MapRoom._showEnemyWait = false; } else if (MapRoom._showAttackWait) { MapRoom._mc.ShowAttack(GLOBAL._currentCell as MapRoomCell); MapRoom._showAttackWait = false; } }
            if (MapRoom._empiredestroyed) { GLOBAL.Message(KEYS.Get("empiredestroyed_newbase")); MapRoom._empiredestroyed = false; }
            if (GLOBAL._ROOT.stage.displayState === StageDisplayState.NORMAL) { if (Chat._bymChat) Chat._bymChat.show(); if (UI_BOTTOM._missions) UI_BOTTOM._missions.visible = true; }
            else { if (Chat._bymChat) Chat._bymChat.hide(); if (UI_BOTTOM._missions) UI_BOTTOM._missions.visible = false; }
        }
        Tutorial.ShowIfNeeded();
    }
    public Hide(): void { if (MapRoom._open && GLOBAL.mode !== GLOBAL.e_BASE_MODE.ATTACK && GLOBAL.mode !== GLOBAL.e_BASE_MODE.WMATTACK) { SOUNDS.Play("close"); if (MapRoom._mc!.parent) MapRoom._mc!.parent.removeChild(MapRoom._mc!); MapRoom.ClearCells(); MapRoom._mc!.Cleanup(); MapRoom._mc = null; } MapRoom._open = false; }
    public BookmarksClear(): void { MapRoom._bookmarkData = {}; MapRoom._bookmarks = []; MapRoom.BookmarksSave(); }
    public FindCell(cellX: number, cellY: number): IMapRoomCell | null { return MapRoom.GetCell(cellX, cellY) as IMapRoomCell; }
    public LoadCell(cellX: number, cellY: number, force: boolean = false): void { MapRoom.GetCell(cellX, cellY, force); }
    public CalculateCellId(cellX: number, cellY: number): number { return cellY * MapRoom._mapWidth + cellX + 1; }
    public Tick(): void { if (MapRoom._open && MapRoom._mc && Boolean(MapRoom._mc.parent)) MapRoom._mc.Tick(); if (MapRoom._open && (!MapRoom._mc || MapRoom._mc && !MapRoom._mc.parent) && BASE._saveCounterA === BASE._saveCounterB) { PLEASEWAIT.Hide(); if (MapRoom._mc) { MapRoom._mc.Cleanup(); MapRoom._mc = null; } MapRoom._mc = new MapRoomPopup(); MapRoom._mc.Setup(); BASE.Cleanup(); GLOBAL._layerWindows.addChild(MapRoom._mc); } }
    public TickFast(): void { }
    public ResizeHandler(): void { if (!MapRoom._viewOnly) MapRoomManager.instance.Hide(); else MapRoom.HideFromViewOnly(); MapRoomManager.instance.ShowDelayed(true); }
}
