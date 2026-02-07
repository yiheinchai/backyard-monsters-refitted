import Event from "openfl/events/Event";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import SecurityErrorEvent from "openfl/events/SecurityErrorEvent";
import Point from "openfl/geom/Point";
import URLLoader from "openfl/net/URLLoader";
import URLRequest from "openfl/net/URLRequest";

import { FriendPicker } from "../mailbox/FriendPicker";
import { BookmarksManager } from "./bookmarks/BookmarksManager";
import { MapRoom3Data } from "./data/MapRoom3Data";
import { MapRoom3Cell } from "./MapRoom3Cell";
import { MapRoom3AssetCache } from "./MapRoom3AssetCache";
import { MapRoom3TileSetManager } from "./tiles/MapRoom3TileSetManager";
import { MapRoom3Window } from "./MapRoom3Window";
import { MapRoom3WindowHUD } from "./MapRoom3WindowHUD";
import { IMapRoom } from "../maproom_manager/IMapRoom";
import { IMapRoomCell } from "../maproom_manager/IMapRoomCell";

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("../../../BASE").BASE; }
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getUI2(): any { return require("../../../UI2").UI2; }



/**
 * MapRoom3 - world map implementation (version 3).
 */
export class MapRoom3 implements IMapRoom {
    private static m_MapRoom3Window: MapRoom3Window | null = null;
    private static m_MapRoom3WindowHUD: MapRoom3WindowHUD | null = null;

    private m_HeightMapLoader: URLLoader | null = null;
    private m_MapRoom3Data: MapRoom3Data | null = null;
    private m_CurrentBookmarkData: Record<string, any> = {};
    private m_LastCenterPoint: Point | null = null;
    private m_WorldID: number = 0;
    private m_Open: boolean = false;

    constructor(headerUrl: string | null) {
        if (headerUrl !== null) {
            this.m_HeightMapLoader = new URLLoader(new URLRequest(headerUrl));
            this.m_HeightMapLoader.addEventListener(Event.COMPLETE, this.OnHeightMapLoaded.bind(this), false, 0, true);
            this.m_HeightMapLoader.addEventListener(IOErrorEvent.IO_ERROR, this.OnHeightMapLoadFailed.bind(this), false, 0, true);
            // Note: IOErrorEvent.NETWORK_ERROR from Flash doesn't exist in OpenFL
            this.m_HeightMapLoader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, this.OnHeightMapLoadFailed.bind(this), false, 0, true);
        }
    }

    public static get mapRoom3Window(): MapRoom3Window | null {
        return MapRoom3.m_MapRoom3Window;
    }

    public static get mapRoom3WindowHUD(): MapRoom3WindowHUD | null {
        return MapRoom3.m_MapRoom3WindowHUD;
    }

    public set bookmarkData(value: Record<string, any>) {
        this.m_CurrentBookmarkData = value;
    }

    public get playerOwnedCells(): Array<IMapRoomCell> | null {
        return this.m_MapRoom3Data ? this.m_MapRoom3Data.playerOwnedCells : null;
    }

    public get allianceDataById(): Map<number, any> | null {
        return this.m_MapRoom3Data ? this.m_MapRoom3Data.allianceDataById : null;
    }

    public get worldID(): number {
        return this.m_WorldID;
    }

    public set worldID(value: number) {
        this.m_WorldID = value;
    }

    public get isOpen(): boolean {
        return this.m_Open;
    }

    public set mapWidth(value: number) {
    }

    public set mapHeight(value: number) {
    }

    public get flingerInRange(): boolean {
        return true;
    }

    public get viewOnly(): boolean {
        return false;
    }

    public OnHeightMapLoaded(event: Event): void {
        const serverData = JSON.parse(this.m_HeightMapLoader!.data);
        this.m_MapRoom3Data = new MapRoom3Data(serverData);
    }

    public OnHeightMapLoadFailed(event: Event): void {
        this.m_MapRoom3Data = new MapRoom3Data(null);
    }

    public Setup(): void {
        this.m_MapRoom3Data!.LoadInitialCellData(this.m_LastCenterPoint);
        FriendPicker.ClearContacts();
    }

    public ReadyToShow(): boolean {
        return Boolean(this.m_MapRoom3Data) && this.m_MapRoom3Data!.areAllCellsCreated && this.m_MapRoom3Data!.isInitialCellDataLoaded && MapRoom3AssetCache.instance.areAssetsLoaded && MapRoom3TileSetManager.instance.isCurrentTileSetAndBackgroundLoaded;
    }

    public ShowDelayed(scrollToHome: boolean = false): void {
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
            getGLOBAL().m_mapRoomFunctional = true;
        }
        if (this.m_Open === true) {
            return;
        }
        this.m_Open = true;
        getBASE().Cleanup();
        this.m_MapRoom3Data!.ParseInitialCellData();
        BookmarksManager.instance.Setup(this.m_CurrentBookmarkData, this.m_MapRoom3Data!);
        this.m_MapRoom3Data!.LoadBookmarkedCells(BookmarksManager.instance.GetBookmarksOfType(BookmarksManager.TYPE_CUSTOM));
        MapRoom3.m_MapRoom3Window = new MapRoom3Window(this.m_MapRoom3Data!);
        MapRoom3.m_MapRoom3WindowHUD = new MapRoom3WindowHUD();
        getGLOBAL()._layerUI.addChild(MapRoom3.m_MapRoom3Window);
        getGLOBAL()._layerUI.addChild(MapRoom3.m_MapRoom3WindowHUD);
        getUI2().SetupHUD();
        if (getGLOBAL()._currentCell === null) {
            getGLOBAL()._currentCell = this.m_MapRoom3Data!.homeCell;
        }
        if (this.m_LastCenterPoint === null) {
            this.m_LastCenterPoint = new Point(this.m_MapRoom3Data!.homeCell.cellX, this.m_MapRoom3Data!.homeCell.cellY);
        }
        MapRoom3.m_MapRoom3Window.Init(this.m_LastCenterPoint);
    }

    public Hide(): void {
        this.m_Open = false;
        this.m_LastCenterPoint = MapRoom3.m_MapRoom3Window!.centerPoint;
        BookmarksManager.instance.Cleanup();
        this.Cleanup();
    }

    private Cleanup(): void {
        if (MapRoom3.m_MapRoom3WindowHUD !== null) {
            MapRoom3.m_MapRoom3WindowHUD.Clear();
            if (MapRoom3.m_MapRoom3WindowHUD.parent !== null) {
                MapRoom3.m_MapRoom3WindowHUD.parent.removeChild(MapRoom3.m_MapRoom3WindowHUD);
            }
            MapRoom3.m_MapRoom3WindowHUD = null;
        }
        if (MapRoom3.m_MapRoom3Window !== null) {
            MapRoom3.m_MapRoom3Window.Clear();
            if (MapRoom3.m_MapRoom3Window.parent !== null) {
                MapRoom3.m_MapRoom3Window.parent.removeChild(MapRoom3.m_MapRoom3Window);
            }
            MapRoom3.m_MapRoom3Window = null;
        }
        if (this.m_MapRoom3Data !== null) {
            this.m_MapRoom3Data.Clear();
        }
    }

    public FindCell(cellX: number, cellY: number): IMapRoomCell | null {
        return this.m_MapRoom3Data ? this.m_MapRoom3Data.GetMapRoom3Cell(cellX, cellY) : null;
    }

    public LoadCell(cellX: number, cellY: number, force: boolean = false): void {
    }

    public CalculateCellId(cellX: number, cellY: number): number {
        return cellY * this.m_MapRoom3Data!.mapWidth + cellX + 1;
    }

    public GetHexCellsInRange(cellX: number, cellY: number, range: number): Array<MapRoom3Cell> {
        if (this.m_MapRoom3Data === null) {
            return [];
        }
        const cell = this.m_MapRoom3Data.GetMapRoom3Cell(cellX, cellY);
        if (cell === null) {
            return [];
        }
        return this.m_MapRoom3Data.GetHexCellsInRange(cell, range);
    }

    public GetClosestCell(cellX: number, cellY: number, range: number): MapRoom3Cell | null {
        if (this.m_MapRoom3Data === null) {
            return null;
        }
        const cell = this.m_MapRoom3Data.GetMapRoom3Cell(cellX, cellY);
        if (cell === null) {
            return null;
        }
        const cells = this.m_MapRoom3Data.GetHexCellsInRange(cell, range);
        let minDist = Number.MAX_VALUE;
        let closest: MapRoom3Cell | null = null;
        for (let i = cells.length - 1; i >= 0; i--) {
            const c = cells[i];
            if (MapRoom3Cell.GetHexDistanceBetween(c, closest!) < minDist) {
                minDist = 0;
                closest = c;
            }
        }
        return closest;
    }

    public Tick(): void {
        if (Boolean(this.m_MapRoom3Data) && Boolean(MapRoom3.m_MapRoom3Window)) {
            this.m_MapRoom3Data!.UpdateCellLoading(MapRoom3.m_MapRoom3Window!.centerPointForLoading);
        }
    }

    public TickFast(): void {
        if (Boolean(this.m_MapRoom3Data) && !this.m_MapRoom3Data!.areAllCellsCreated) {
            this.m_MapRoom3Data!.UpdateCellCreation();
            return;
        }
        if (MapRoom3.m_MapRoom3Window) {
            MapRoom3.m_MapRoom3Window.TickFast();
        }
    }

    public ResizeHandler(): void {
        if (MapRoom3.m_MapRoom3Window) {
            MapRoom3.m_MapRoom3Window.Resize();
        }
        if (MapRoom3.m_MapRoom3WindowHUD) {
            MapRoom3.m_MapRoom3WindowHUD.Resize();
        }
    }

    public BookmarksClear(): void {
        BookmarksManager.instance.Cleanup();
        BookmarksManager.instance.SaveBookmarks();
    }
}
