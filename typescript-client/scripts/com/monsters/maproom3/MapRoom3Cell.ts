import { ABTest } from "../../cc/tests/ABTest";
import { Console } from "../debug/Console";
import { EnumBaseRelationship } from "../../enums/EnumBaseRelationship";
import { EnumYardType } from "../../enums/EnumYardType";
import { MapRoom3AllianceData } from "./data/MapRoom3AllianceData";
import { MapRoom3CellData } from "./data/MapRoom3CellData";
import { MapRoom3Data } from "./data/MapRoom3Data";
import { MapRoom3TileSetManager } from "./tiles/MapRoom3TileSetManager";
import { IMapRoomCell } from "../maproom_manager/IMapRoomCell";
import { MapRoomManager } from "../maproom_manager/MapRoomManager";
import { MapRoom3 } from "./MapRoom3";
import { MapRoom3AssetCache } from "./MapRoom3AssetCache";
import { MapRoom3CellGraphic } from "./MapRoom3CellGraphic";

import { BASE } from "../../../BASE";
import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { LOGIN } from "../../../LOGIN";
import { PLEASEWAIT } from "../../../PLEASEWAIT";
import { URLLoaderApi } from "../../../URLLoaderApi";

/**
 * MapRoom3Cell - represents a single cell in Map Room 3.
 */
export class MapRoom3Cell implements IMapRoomCell {
    private static readonly ATTACK_COST_MULTIPLIERS_BY_TOWN_HALL_LEVEL: Array<number> = [0, 100, 200, 400, 800, 1600, 4000, 10000, 25000, 75000, 225000];
    private static readonly MAX_BITS_CELL_X: number = 9;
    private static readonly MAX_BITS_CELL_Y: number = 9;
    private static readonly MAX_BITS_CELL_HEIGHT: number = 7;
    private static readonly MAX_BITS_CELL_TYPE: number = 7;
    private static readonly MAX_VALUE_CELL_X: number = Math.pow(2, MapRoom3Cell.MAX_BITS_CELL_X) - 1;
    private static readonly MAX_VALUE_CELL_Y: number = Math.pow(2, MapRoom3Cell.MAX_BITS_CELL_Y) - 1;
    private static readonly MAX_VALUE_CELL_HEIGHT: number = Math.pow(2, MapRoom3Cell.MAX_BITS_CELL_HEIGHT) - 1;
    private static readonly MAX_VALUE_CELL_TYPE: number = Math.pow(2, MapRoom3Cell.MAX_BITS_CELL_TYPE) - 1;
    private static readonly BIT_SHIFT_CELL_X: number = 0;
    private static readonly BIT_SHIFT_CELL_Y: number = MapRoom3Cell.BIT_SHIFT_CELL_X + MapRoom3Cell.MAX_BITS_CELL_X;
    private static readonly BIT_SHIFT_CELL_HEIGHT: number = MapRoom3Cell.BIT_SHIFT_CELL_Y + MapRoom3Cell.MAX_BITS_CELL_Y;
    private static readonly BIT_SHIFT_CELL_TYPE: number = MapRoom3Cell.BIT_SHIFT_CELL_HEIGHT + MapRoom3Cell.MAX_BITS_CELL_HEIGHT;

    private static s_CellsInAttackRange: Map<number, Array<MapRoom3Cell>> = new Map();
    private static s_InAttackRangeOfCells: Map<number, Array<MapRoom3Cell>> = new Map();
    private static s_InRangeOfStrongholds: Map<number, Array<MapRoom3Cell>> = new Map();
    private static s_CurrentBuffEffectFrames: Map<number, number> = new Map();

    private m_CellData: MapRoom3CellData | null = null;
    private m_CellGraphic: MapRoom3CellGraphic | null = null;
    private m_CellHeaderBitField: number = 0;

    constructor(cellX: number, cellY: number, cellHeight: number, cellType: number) {
        if (cellType === -1) {
            cellType = EnumYardType.EMPTY;
        }
        this.m_CellHeaderBitField |= (cellX & MapRoom3Cell.MAX_VALUE_CELL_X) << MapRoom3Cell.BIT_SHIFT_CELL_X;
        this.m_CellHeaderBitField |= (cellY & MapRoom3Cell.MAX_VALUE_CELL_Y) << MapRoom3Cell.BIT_SHIFT_CELL_Y;
        this.m_CellHeaderBitField |= (cellHeight & MapRoom3Cell.MAX_VALUE_CELL_HEIGHT) << MapRoom3Cell.BIT_SHIFT_CELL_HEIGHT;
        this.m_CellHeaderBitField |= (cellType & MapRoom3Cell.MAX_VALUE_CELL_TYPE) << MapRoom3Cell.BIT_SHIFT_CELL_TYPE;
    }

    public static GetHexDistanceBetween(cell1: IMapRoomCell, cell2: IMapRoomCell): number {
        const y1 = cell1.cellY;
        const y2 = cell2.cellY;
        const x1 = cell1.cellX - Math.floor(y1 * 0.5);
        const x2 = cell2.cellX - Math.floor(y2 * 0.5);
        const dx = x2 - x1;
        const dy = y2 - y1;
        if (dx * dy >= 0) {
            return Math.abs(dx + dy);
        }
        return Math.max(Math.abs(dx), Math.abs(dy));
    }

    public get cellX(): number {
        return (this.m_CellHeaderBitField >> MapRoom3Cell.BIT_SHIFT_CELL_X) & MapRoom3Cell.MAX_VALUE_CELL_X;
    }

    public get cellY(): number {
        return (this.m_CellHeaderBitField >> MapRoom3Cell.BIT_SHIFT_CELL_Y) & MapRoom3Cell.MAX_VALUE_CELL_Y;
    }

    public get cellHeight(): number {
        return (this.m_CellHeaderBitField >> MapRoom3Cell.BIT_SHIFT_CELL_HEIGHT) & MapRoom3Cell.MAX_VALUE_CELL_HEIGHT;
    }

    public get cellType(): number {
        return (this.m_CellHeaderBitField >> MapRoom3Cell.BIT_SHIFT_CELL_TYPE) & MapRoom3Cell.MAX_VALUE_CELL_TYPE;
    }

    public get baseType(): number {
        return this.cellType;
    }

    public get cellGraphic(): MapRoom3CellGraphic | null {
        return this.m_CellGraphic;
    }

    public set cellGraphic(value: MapRoom3CellGraphic | null) {
        this.m_CellGraphic = value;
    }

    public get name(): string {
        return this.m_CellData ? this.m_CellData.name : "";
    }

    public get facebookID(): string {
        return this.m_CellData ? this.m_CellData.facebookID : "";
    }

    public get baseID(): number {
        return this.m_CellData ? this.m_CellData.baseID : 0;
    }

    public get userID(): number {
        return this.m_CellData ? this.m_CellData.userID : 0;
    }

    public get allianceID(): number {
        return this.m_CellData ? this.m_CellData.allianceID : 0;
    }

    public get wildMonsterTribeId(): number {
        return this.m_CellData ? this.m_CellData.wildMonsterTribeId : 0;
    }

    public get relationship(): number {
        return this.m_CellData ? this.m_CellData.relationship : EnumBaseRelationship.k_RELATIONSHIP_NONE;
    }

    public get baseLevel(): number {
        return this.m_CellData ? this.m_CellData.baseLevel : 0;
    }

    public get playerLevel(): number {
        return this.m_CellData ? this.m_CellData.playerLevel : 0;
    }

    public get damage(): number {
        return this.m_CellData ? this.m_CellData.damage : 0;
    }

    public get damagePercentage(): number {
        return this.damage / 100;
    }

    public get attackRange(): number {
        return this.m_CellData ? this.m_CellData.attackRange : 0;
    }

    public get attackCost(): Array<number> {
        return this.CalculateAttackCosts();
    }

    public get containsValidBase(): boolean {
        return this.baseID !== 0;
    }

    public get hasDamageProtection(): boolean {
        return this.m_CellData ? this.m_CellData.hasDamageProtection : false;
    }

    public get hasTruce(): boolean {
        return this.m_CellData ? this.m_CellData.hasTruce : false;
    }

    public get isBorder(): boolean {
        return this.cellType === EnumYardType.BORDER;
    }

    public get isBlocked(): boolean {
        return this.isBorder || this.cellHeight >= MapRoom3TileSetManager.BLOCKED_CELL_STARTING_HEIGHT;
    }

    public get isDataLoaded(): boolean {
        return this.m_CellData !== null;
    }

    public get isDestroyed(): boolean {
        return this.m_CellData ? this.m_CellData.isDestroyed : false;
    }

    public get isLocked(): boolean {
        return this.m_CellData ? this.m_CellData.isLocked : false;
    }

    public get isInvisible(): boolean {
        return this.m_CellData ? this.m_CellData.isInvisible && !this.isOwnedByPlayer : false;
    }

    public get isOwnedByPlayer(): boolean {
        return this.userID === LOGIN._playerID;
    }

    public get isOwnedByFacebookFriend(): boolean {
        return this.m_CellData ? this.m_CellData.isFacebookFriend : false;
    }

    public get isOwnedByWildMonster(): boolean {
        return this.userID === 0 && this.baseID !== 0;
    }

    public get isRandomWildMonsterBase(): boolean {
        return this.isOwnedByWildMonster && this.cellType === EnumYardType.EMPTY;
    }

    public Setup(cellData: Record<string, any>): void {
        if (cellData.hasOwnProperty("i")) {
            const height = cellData.i;
            this.m_CellHeaderBitField &= ~(MapRoom3Cell.MAX_VALUE_CELL_HEIGHT << MapRoom3Cell.BIT_SHIFT_CELL_HEIGHT);
            this.m_CellHeaderBitField |= (height & MapRoom3Cell.MAX_VALUE_CELL_HEIGHT) << MapRoom3Cell.BIT_SHIFT_CELL_HEIGHT;
        }
        if (cellData.hasOwnProperty("b")) {
            let type = cellData.b;
            if (type === -1) {
                type = EnumYardType.EMPTY;
            }
            this.m_CellHeaderBitField &= ~(MapRoom3Cell.MAX_VALUE_CELL_TYPE << MapRoom3Cell.BIT_SHIFT_CELL_TYPE);
            this.m_CellHeaderBitField |= (type & MapRoom3Cell.MAX_VALUE_CELL_TYPE) << MapRoom3Cell.BIT_SHIFT_CELL_TYPE;
        }
        if (this.m_CellData !== null) {
            this.m_CellData.Map(cellData);
        } else {
            this.m_CellData = new MapRoom3CellData(cellData);
        }
    }

    public ClearData(): void {
        const cellId = MapRoomManager.instance.CalculateCellId(this.cellX, this.cellY);
        const cellsInRange = MapRoom3Cell.s_CellsInAttackRange.get(cellId);
        if (cellsInRange !== undefined) {
            cellsInRange.length = 0;
        }
        const inRangeOf = MapRoom3Cell.s_InAttackRangeOfCells.get(cellId);
        if (inRangeOf !== undefined) {
            inRangeOf.length = 0;
        }
        const strongholds = MapRoom3Cell.s_InRangeOfStrongholds.get(cellId);
        if (strongholds !== undefined) {
            strongholds.length = 0;
        }
        MapRoom3Cell.s_CurrentBuffEffectFrames.delete(cellId);
        this.m_CellData = null;
    }

    public AddCellInAttackRange(cell: MapRoom3Cell): void {
        const cellId = MapRoomManager.instance.CalculateCellId(this.cellX, this.cellY);
        let cells = MapRoom3Cell.s_CellsInAttackRange.get(cellId);
        if (!cells) {
            cells = [];
            MapRoom3Cell.s_CellsInAttackRange.set(cellId, cells);
        }
        if (cells.indexOf(cell) === -1) {
            cells.push(cell);
        }
    }

    public AddInAttackRangeOf(cell: MapRoom3Cell): void {
        const cellId = MapRoomManager.instance.CalculateCellId(this.cellX, this.cellY);
        let cells = MapRoom3Cell.s_InAttackRangeOfCells.get(cellId);
        if (!cells) {
            cells = [];
            MapRoom3Cell.s_InAttackRangeOfCells.set(cellId, cells);
        }
        if (cells.indexOf(cell) === -1) {
            cells.push(cell);
        }
    }

    public AddInRangeOfStronghold(cell: MapRoom3Cell): void {
        const cellId = MapRoomManager.instance.CalculateCellId(this.cellX, this.cellY);
        let cells = MapRoom3Cell.s_InRangeOfStrongholds.get(cellId);
        if (!cells) {
            cells = [];
            MapRoom3Cell.s_InRangeOfStrongholds.set(cellId, cells);
        }
        if (cells.indexOf(cell) === -1) {
            cells.push(cell);
        }
    }

    public get hasCellsInAttackRange(): boolean {
        const cellId = MapRoomManager.instance.CalculateCellId(this.cellX, this.cellY);
        const cells = MapRoom3Cell.s_CellsInAttackRange.get(cellId);
        return cells !== undefined && cells.length > 0;
    }

    public get cellsInAttackRange(): Array<MapRoom3Cell> | undefined {
        const cellId = MapRoomManager.instance.CalculateCellId(this.cellX, this.cellY);
        return MapRoom3Cell.s_CellsInAttackRange.get(cellId);
    }

    public get isInAttackRange(): boolean {
        const cellId = MapRoomManager.instance.CalculateCellId(this.cellX, this.cellY);
        const cells = MapRoom3Cell.s_InAttackRangeOfCells.get(cellId);
        return cells !== undefined && cells.length > 0;
    }

    public get inAttackRangeOfCells(): Array<MapRoom3Cell> | undefined {
        const cellId = MapRoomManager.instance.CalculateCellId(this.cellX, this.cellY);
        return MapRoom3Cell.s_InAttackRangeOfCells.get(cellId);
    }

    public get isInRangeOfStronghold(): boolean {
        const cellId = MapRoomManager.instance.CalculateCellId(this.cellX, this.cellY);
        const cells = MapRoom3Cell.s_InRangeOfStrongholds.get(cellId);
        return cells !== undefined && cells.length > 0;
    }

    public get inRangeOfStrongholds(): Array<MapRoom3Cell> | undefined {
        const cellId = MapRoomManager.instance.CalculateCellId(this.cellX, this.cellY);
        return MapRoom3Cell.s_InRangeOfStrongholds.get(cellId);
    }

    public get currentBuffEffectFrame(): number {
        const cellId = MapRoomManager.instance.CalculateCellId(this.cellX, this.cellY);
        let frame = MapRoom3Cell.s_CurrentBuffEffectFrames.get(cellId);
        if (frame === undefined) {
            frame = Math.floor(Math.random() * MapRoom3AssetCache.STRONGHOLD_BUFF_EFFECT_TOTAL_FRAMES);
            MapRoom3Cell.s_CurrentBuffEffectFrames.set(cellId, frame);
        }
        return frame;
    }

    public set currentBuffEffectFrame(value: number) {
        const cellId = MapRoomManager.instance.CalculateCellId(this.cellX, this.cellY);
        MapRoom3Cell.s_CurrentBuffEffectFrames.set(cellId, value);
    }

    public DoesContainDisplayableBase(): boolean {
        return !this.isBorder && !this.isBlocked && !this.isInvisible && this.containsValidBase;
    }

    public LoadForAttack(): void {
        this.LoadLatestData(this.OnLoadedForAttack.bind(this));
    }

    public LoadForBuild(): void {
        this.LoadLatestData(this.OnLoadedForBuild.bind(this));
    }

    private LoadLatestData(callback: Function): void {
        PLEASEWAIT.Show(KEYS.Get("msg_loading"));
        const cellId = MapRoomManager.instance.CalculateCellId(this.cellX, this.cellY);
        const vars = [["cellids", JSON.stringify([cellId])]];
        new URLLoaderApi().load(MapRoom3Data.GetCellsRequestURL(), vars, callback);
    }

    public OnLoadedForAttack(data: Record<string, any>): void {
        PLEASEWAIT.Hide();
        if (data === null || data.celldata === null || !(data.celldata instanceof Array) || data.celldata.length === 0) {
            GLOBAL.Message(KEYS.Get("mr3_base_locked_cannot_attack"), KEYS.Get("btn_ok"));
            return;
        }
        this.Setup(data.celldata[0]);
        if (this.isLocked) {
            GLOBAL.Message(KEYS.Get("mr3_base_locked_cannot_attack"), KEYS.Get("btn_ok"));
            return;
        }
        GLOBAL._currentCell = this;
        const cellId = MapRoomManager.instance.CalculateCellId(this.cellX, this.cellY);
        if (this.userID === 0) {
            BASE.LoadBase(null, 0, this.baseID, GLOBAL.e_BASE_MODE.WMVIEW, false, this.cellType, cellId);
        } else {
            BASE.LoadBase(null, 0, this.baseID, this.isOwnedByFacebookFriend ? GLOBAL.e_BASE_MODE.HELP : GLOBAL.e_BASE_MODE.VIEW, false, this.cellType, cellId);
        }
    }

    public OnLoadedForBuild(data: Record<string, any>): void {
        PLEASEWAIT.Hide();
        if (data === null || data.celldata === null || !(data.celldata instanceof Array) || data.celldata.length === 0) {
            GLOBAL.Message(KEYS.Get("mr3_base_locked_cannot_enter"), KEYS.Get("btn_ok"));
            return;
        }
        this.Setup(data.celldata[0]);
        if (this.isLocked || this.isOwnedByPlayer === false) {
            GLOBAL.Message(KEYS.Get("mr3_base_locked_cannot_enter"), KEYS.Get("btn_ok"));
            MapRoom3.mapRoom3Window.Refresh();
            return;
        }
        GLOBAL._currentCell = this;
        const cellId = MapRoomManager.instance.CalculateCellId(this.cellX, this.cellY);
        BASE.LoadBase(null, 0, this.baseID, GLOBAL.e_BASE_MODE.BUILD, false, this.cellType, cellId);
    }

    private CalculateAttackCosts(): Array<number> {
        const costs = [0, 0, 0, 0];
        if (this.isInAttackRange === true) {
            return costs;
        }
        let minDistance = Number.MAX_VALUE;
        let nearestCell: MapRoom3Cell | null = null;
        const playerCells = MapRoomManager.instance.playerOwnedCells;
        const count = playerCells.length;
        for (let i = 0; i < count; i++) {
            const cell = playerCells[i] as MapRoom3Cell;
            switch (cell.cellType) {
                case EnumYardType.PLAYER:
                case EnumYardType.RESOURCE:
                case EnumYardType.STRONGHOLD:
                    const hexDist = MapRoom3Cell.GetHexDistanceBetween(cell, this);
                    const distance = Math.max(0, hexDist - cell.attackRange);
                    if (distance < minDistance) {
                        minDistance = distance;
                        nearestCell = cell;
                    }
                    break;
            }
        }
        if (nearestCell === null) {
            return costs;
        }
        const townHallLevel = GLOBAL.attackingPlayer.townHallLevel;
        const levelIndex = Math.min(townHallLevel, MapRoom3Cell.ATTACK_COST_MULTIPLIERS_BY_TOWN_HALL_LEVEL.length - 1);
        const baseCost = MapRoom3Cell.ATTACK_COST_MULTIPLIERS_BY_TOWN_HALL_LEVEL[levelIndex] * MapRoomManager.instance.attackCostMultiplier.value;
        const cost = minDistance * (baseCost * this.GetABTestAttackCostMultiplier());
        costs[0] = cost;
        costs[1] = cost;
        costs[2] = cost;
        costs[3] = 0;
        return costs;
    }

    private GetABTestAttackCostMultiplier(): number {
        const value = ABTest.lastTwoDigits(ABTest.UserMD5("flingercosts"));
        if (value >= 256) {
            return 1;
        }
        if (value >= 168) {
            return 1.5;
        }
        if (value >= 84) {
            return 0.5;
        }
        Console.warning("AB test on attack cost didnt work.");
        return 1;
    }

    public DoesFortify(cell: MapRoom3Cell): boolean {
        if (cell === null) {
            return false;
        }
        if (cell.DoesContainDisplayableBase() === false) {
            return false;
        }
        if (this.cellType !== EnumYardType.FORTIFICATION) {
            return false;
        }
        if (this.userID !== cell.userID) {
            return false;
        }
        if (this.wildMonsterTribeId !== cell.wildMonsterTribeId) {
            return false;
        }
        return cell.cellType === EnumYardType.PLAYER || cell.cellType === EnumYardType.RESOURCE || cell.cellType === EnumYardType.STRONGHOLD;
    }

    public GetLocalisedCellTypeName(): string {
        switch (this.cellType) {
            case EnumYardType.PLAYER:
                return KEYS.Get("mr3_starter_cell_name");
            case EnumYardType.RESOURCE:
                return KEYS.Get("mr3_resource_cell_name");
            case EnumYardType.STRONGHOLD:
                return KEYS.Get("mr3_stronghold_cell_name");
            case EnumYardType.FORTIFICATION:
                return KEYS.Get("mr3_fortification_cell_name");
            case EnumYardType.EMPTY:
            default:
                if (this.isOwnedByWildMonster) {
                    return KEYS.Get("mr3_wild_monster_cell_name");
                }
                return "";
        }
    }

    public GetAllianceData(): MapRoom3AllianceData | undefined {
        return MapRoomManager.instance.allianceDataById.get(this.allianceID);
    }
}
