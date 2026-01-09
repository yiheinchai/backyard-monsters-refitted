import { Point } from "openfl/geom/Point";
import { getTimer } from "openfl/utils/getTimer";

import { EnumYardType } from "../../enums/EnumYardType";
import { MapRoom3 } from "../MapRoom3";
import { MapRoom3Cell } from "../MapRoom3Cell";
import { Bookmark } from "../bookmarks/Bookmark";
import { MapRoom3TileSetManager } from "../tiles/MapRoom3TileSetManager";
import { IMapRoomCell } from "../../maproom_manager/IMapRoomCell";
import { MapRoomManager } from "../../maproom_manager/MapRoomManager";
import { MapRoom3AllianceData } from "./MapRoom3AllianceData";

import { URLLoaderApi } from "../../../../URLLoaderApi";

/**
 * MapRoom3Data - data management for Map Room 3.
 */
export class MapRoom3Data {
    private static readonly CELL_LOAD_BUFFER_X: number = 30;
    private static readonly CELL_LOAD_BUFFER_Y: number = 30;
    private static readonly MAX_CELLS_TO_REQUEST: number = 500;
    private static readonly DEFAULT_CELL_EXPIRIY_TIME: number = 120000;
    private static readonly PLAYER_CELL_EXPIRIY_TIME: number = 30000;
    private static readonly CELL_CREATION_LOOP_TIMEOUT: number = 25;
    public static DEBUG_WORLD_ID: number = 0;

    private m_Width: number = 0;
    private m_Height: number = 0;
    private m_BorderCell: MapRoom3Cell | null = null;
    private m_MapRoom3Cells: Array<MapRoom3Cell> = [];
    private m_PlayerOwnedCells: Array<IMapRoomCell> = [];
    private m_AllianceDataById: Map<number, MapRoom3AllianceData> = new Map();
    private m_PendingCellDataRequest: any = null;
    private m_ExpiryTimeByCellId: Map<number, number> = new Map();
    private m_CreatingMapData: any = null;
    private m_CellCreationIndexX: number = -1;
    private m_CellCreationIndexY: number = -1;
    private m_InitialCellData: any = null;
    private m_InitialPlayerCellData: any = null;
    private m_InitialCentrePoint: Point | null = null;

    constructor(serverData: Record<string, any> | null = null) {
        if (serverData === null) {
            serverData = MapRoom3Data.GenerateDefaultMapData();
        }
        this.m_Width = serverData.width;
        this.m_Height = serverData.height;
        this.m_BorderCell = new MapRoom3Cell(0, 0, MapRoom3TileSetManager.BORDER_CELL_HEIGHT, EnumYardType.BORDER);
        const totalCells = this.m_Width * this.m_Height;
        this.m_MapRoom3Cells = new Array<MapRoom3Cell>(totalCells);
        this.m_PlayerOwnedCells = [];
        this.m_CreatingMapData = serverData;
        this.m_CellCreationIndexX = 0;
        this.m_CellCreationIndexY = 0;
        this.UpdateCellCreation();
    }

    public static GetCellsRequestURL(): string {
        return MapRoomManager.instance.mapRoom3URL + "getcells";
    }

    private static GenerateDefaultMapData(): Record<string, any> {
        const size = 500;
        const data: Record<string, any> = {};
        data.width = size;
        data.height = size;
        data.data = [];
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                data.data.push({ "h": 0, "t": EnumYardType.EMPTY });
            }
        }
        return data;
    }

    public get mapWidth(): number {
        return this.m_Width;
    }

    public get mapHeight(): number {
        return this.m_Height;
    }

    public get playerOwnedCells(): Array<IMapRoomCell> {
        return this.m_PlayerOwnedCells;
    }

    public get homeCell(): IMapRoomCell | null {
        return Boolean(this.m_PlayerOwnedCells) && Boolean(this.m_PlayerOwnedCells.length) ? this.m_PlayerOwnedCells[0] : null;
    }

    public get allianceDataById(): Map<number, MapRoom3AllianceData> {
        return this.m_AllianceDataById;
    }

    public get areAllCellsCreated(): boolean {
        return this.m_CreatingMapData === null;
    }

    public get isInitialCellDataLoaded(): boolean {
        return this.m_InitialCellData !== null && this.m_InitialPlayerCellData !== null;
    }

    public UpdateCellCreation(): void {
        if (this.areAllCellsCreated === true) {
            return;
        }
        const timer = getTimer();
        while (this.m_CellCreationIndexX < this.m_Width) {
            while (this.m_CellCreationIndexY < this.m_Height) {
                const index = this.GetCellIndex(this.m_CellCreationIndexX, this.m_CellCreationIndexY);
                const cellData = this.m_CreatingMapData.data[index];
                this.m_MapRoom3Cells[index] = new MapRoom3Cell(this.m_CellCreationIndexX, this.m_CellCreationIndexY, cellData.h, cellData.t);
                if (getTimer() - timer > MapRoom3Data.CELL_CREATION_LOOP_TIMEOUT) {
                    return;
                }
                ++this.m_CellCreationIndexY;
            }
            this.m_CellCreationIndexY = 0;
            ++this.m_CellCreationIndexX;
        }
        this.m_CreatingMapData = null;
    }

    public LoadInitialCellData(centrePoint: Point): void {
        if (this.areAllCellsCreated) {
            const totalCells = this.m_MapRoom3Cells.length;
            for (let i = 0; i < totalCells; i++) {
                this.m_MapRoom3Cells[i].ClearData();
            }
            this.m_PlayerOwnedCells.length = 0;
        }
        this.m_InitialCentrePoint = centrePoint;
        const vars: Array<any> = [];
        if (MapRoom3Data.DEBUG_WORLD_ID) {
            vars.push(["worldid", MapRoom3Data.DEBUG_WORLD_ID]);
        }
        new URLLoaderApi().load(MapRoomManager.instance.mapRoom3URL + "initworldmap", vars, this.OnInitialPlayerCellDataLoaded.bind(this));
    }

    private OnInitialPlayerCellDataLoaded(initworldmapData: Record<string, any>): void {
        this.m_InitialPlayerCellData = initworldmapData;
        if (this.m_InitialCentrePoint === null) {
            this.m_InitialCentrePoint = new Point(initworldmapData.celldata[0].x, initworldmapData.celldata[0].y);
        }
        const cellIds: Array<number> = [];
        const minX = Math.max(0, this.m_InitialCentrePoint.x - MapRoom3Data.CELL_LOAD_BUFFER_X);
        const maxX = Math.min(this.m_Width, this.m_InitialCentrePoint.x + MapRoom3Data.CELL_LOAD_BUFFER_Y + 1);
        const minY = Math.max(0, this.m_InitialCentrePoint.y - MapRoom3Data.CELL_LOAD_BUFFER_Y);
        const maxY = Math.min(this.m_Height, this.m_InitialCentrePoint.y + MapRoom3Data.CELL_LOAD_BUFFER_Y + 1);
        for (let x = minX; x < maxX; x++) {
            for (let y = minY; y < maxY; y++) {
                const cellId = MapRoomManager.instance.CalculateCellId(x, y);
                cellIds.push(cellId);
            }
        }
        const vars: Array<any> = [["cellids", JSON.stringify(cellIds)]];
        if (MapRoom3Data.DEBUG_WORLD_ID) {
            vars.push(["worldid", MapRoom3Data.DEBUG_WORLD_ID]);
        }
        new URLLoaderApi().load(MapRoom3Data.GetCellsRequestURL(), vars, this.OnInitialCellDataLoaded.bind(this));
    }

    private OnInitialCellDataLoaded(data: Record<string, any>): void {
        this.m_InitialCellData = data;
    }

    public ParseInitialCellData(): void {
        if (this.m_InitialPlayerCellData !== null) {
            this.ParseCellData(this.m_InitialPlayerCellData);
        }
        if (this.m_InitialCellData !== null) {
            this.ParseCellData(this.m_InitialCellData);
        }
    }

    private GetCellIndex(x: number, y: number): number {
        return x < 0 || y < 0 || x >= this.m_Width || y >= this.m_Height ? -1 : y * this.m_Width + x;
    }

    public GetMapRoom3Cell(x: number, y: number): MapRoom3Cell {
        const index = this.GetCellIndex(x, y);
        if (index !== -1 && this.m_MapRoom3Cells.length > index) {
            return this.m_MapRoom3Cells[index];
        }
        return this.m_BorderCell!;
    }

    public Clear(): void {
        this.m_PendingCellDataRequest = null;
        this.m_InitialCellData = null;
        this.m_InitialPlayerCellData = null;
        this.m_InitialCentrePoint = null;
        this.m_ExpiryTimeByCellId = new Map();
        this.m_AllianceDataById = new Map();
    }

    public LoadBookmarkedCells(bookmarks: Array<Bookmark>): void {
        if (this.m_PendingCellDataRequest !== null) {
            return;
        }
        const cellIds: Array<number> = [];
        const timer = getTimer();
        const count = bookmarks.length;
        for (let i = 0; i < count; i++) {
            const cellX = bookmarks[i].cellX;
            const cellY = bookmarks[i].cellY;
            if (!(cellX < 0 || cellX >= this.m_Width || cellY < 0 || cellY >= this.m_Height)) {
                const cellId = MapRoomManager.instance.CalculateCellId(cellX, cellY);
                const expiry = this.m_ExpiryTimeByCellId.get(cellId);
                if (!(expiry !== undefined && (expiry === -1 || timer < expiry))) {
                    this.m_ExpiryTimeByCellId.set(cellId, -1);
                    cellIds.push(cellId);
                    if (cellIds.length >= MapRoom3Data.MAX_CELLS_TO_REQUEST) {
                        break;
                    }
                }
            }
        }
        if (cellIds.length === 0) {
            return;
        }
        const vars: Array<any> = [["cellids", JSON.stringify(cellIds)]];
        if (MapRoom3Data.DEBUG_WORLD_ID) {
            vars.push(["worldid", MapRoom3Data.DEBUG_WORLD_ID]);
        }
        this.m_PendingCellDataRequest = vars;
        new URLLoaderApi().load(MapRoom3Data.GetCellsRequestURL(), vars, this.OnCellDataLoaded.bind(this));
    }

    public UpdateCellLoading(centre: Point): void {
        if (this.m_PendingCellDataRequest !== null) {
            return;
        }
        const cellIds: Array<number> = [];
        let dx = 0;
        let dy = 0;
        let dirX = 0;
        let dirY = -1;
        const centreX = Math.floor(centre.x);
        const centreY = Math.floor(centre.y);
        const timer = getTimer();
        const maxIterations = MapRoom3Data.CELL_LOAD_BUFFER_X * MapRoom3Data.CELL_LOAD_BUFFER_Y * 4;
        for (let i = 0; i < maxIterations; i++) {
            const cellX = centreX + dx;
            const cellY = centreY + dy;
            if (dx === dy || (dx < 0 && dx === -dy) || (dx > 0 && dx === 1 - dy)) {
                const temp = dirX;
                dirX = -dirY;
                dirY = temp;
            }
            dx += dirX;
            dy += dirY;
            if (!(cellX < 0 || cellX >= this.m_Width || cellY < 0 || cellY >= this.m_Height)) {
                const cellId = MapRoomManager.instance.CalculateCellId(cellX, cellY);
                const expiry = this.m_ExpiryTimeByCellId.get(cellId);
                if (!(expiry !== undefined && (expiry === -1 || timer < expiry))) {
                    this.m_ExpiryTimeByCellId.set(cellId, -1);
                    cellIds.push(cellId);
                    if (cellIds.length >= MapRoom3Data.MAX_CELLS_TO_REQUEST) {
                        break;
                    }
                }
            }
        }
        if (cellIds.length === 0) {
            return;
        }
        const vars: Array<any> = [["cellids", JSON.stringify(cellIds)]];
        if (MapRoom3Data.DEBUG_WORLD_ID) {
            vars.push(["worldid", MapRoom3Data.DEBUG_WORLD_ID]);
        }
        this.m_PendingCellDataRequest = vars;
        new URLLoaderApi().load(MapRoom3Data.GetCellsRequestURL(), vars, this.OnCellDataLoaded.bind(this));
    }

    private OnCellDataLoaded(getcellsData: Record<string, any>): void {
        if (this.m_PendingCellDataRequest === null) {
            return;
        }
        this.m_PendingCellDataRequest = null;
        this.ParseCellData(getcellsData);
    }

    private ParseCellData(getcellsData: Record<string, any>): void {
        const cellDataArray = getcellsData.celldata;
        const timer = getTimer();
        const count = cellDataArray.length;
        for (let i = 0; i < count; i++) {
            const cellData = cellDataArray[i];
            const mapRoomCell = this.GetMapRoom3Cell(cellData.x, cellData.y);
            mapRoomCell.Setup(cellData);
            const cellID = MapRoomManager.instance.CalculateCellId(mapRoomCell.cellX, mapRoomCell.cellY);
            this.m_ExpiryTimeByCellId.set(cellID, timer + MapRoom3Data.DEFAULT_CELL_EXPIRIY_TIME);
            if (mapRoomCell.isOwnedByPlayer) {
                this.m_ExpiryTimeByCellId.set(cellID, timer + MapRoom3Data.PLAYER_CELL_EXPIRIY_TIME);
                this.UpdateCellsInAttackRange(mapRoomCell);
                if (this.m_PlayerOwnedCells.indexOf(mapRoomCell) === -1) {
                    this.m_PlayerOwnedCells.push(mapRoomCell);
                }
            }
            if (mapRoomCell.cellType === EnumYardType.STRONGHOLD) {
                this.UpdateCellsInStrongholdRange(mapRoomCell);
            }
        }
        if (getcellsData.alliancedata !== null) {
            this.OnAllianceDataLoaded(getcellsData.alliancedata);
        }
        if (MapRoom3.mapRoom3Window !== null) {
            MapRoom3.mapRoom3Window.Refresh();
        }
    }

    private UpdateCellsInAttackRange(cell: MapRoom3Cell): void {
        const cells = this.GetHexCellsInRange(cell, cell.attackRange);
        const count = cells.length;
        for (let i = 0; i < count; i++) {
            const targetCell = cells[i];
            cell.AddCellInAttackRange(targetCell);
            targetCell.AddInAttackRangeOf(cell);
        }
    }

    private UpdateCellsInStrongholdRange(cell: MapRoom3Cell): void {
        const cells = this.GetHexCellsInRange(cell, cell.attackRange);
        const count = cells.length;
        for (let i = 0; i < count; i++) {
            const targetCell = cells[i];
            targetCell.AddInRangeOfStronghold(cell);
        }
    }

    private OnAllianceDataLoaded(allianceData: Array<any>): void {
        const count = allianceData.length;
        for (let i = 0; i < count; i++) {
            const data = allianceData[i];
            const allianceId = data.alliance_id;
            const existing = this.m_AllianceDataById.get(allianceId);
            if (existing !== undefined) {
                existing.Map(data);
            } else {
                this.m_AllianceDataById.set(allianceId, new MapRoom3AllianceData(data));
            }
        }
    }

    public GetHexCellsInRange(cell: MapRoom3Cell, range: number): Array<MapRoom3Cell> {
        const cells: Array<MapRoom3Cell> = [];
        const cellX = cell.cellX;
        const cellY = cell.cellY;
        let minX = cellX - (cellY % 2 ? Math.floor(range * 0.5) : Math.ceil(range * 0.5));
        let maxX = minX + range;
        const minY = cellY - range;
        const maxY = cellY + range;
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                const targetCell = this.GetMapRoom3Cell(x, y);
                if (targetCell !== null && targetCell !== this.m_BorderCell) {
                    cells.push(targetCell);
                }
            }
            if (y < cellY) {
                if (y % 2) {
                    maxX++;
                } else {
                    minX--;
                }
            } else {
                if (y % 2) {
                    minX++;
                } else {
                    maxX--;
                }
            }
        }
        return cells;
    }
}
