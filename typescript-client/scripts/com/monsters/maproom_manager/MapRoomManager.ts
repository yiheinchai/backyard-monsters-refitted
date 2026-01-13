import IOErrorEvent from "openfl/events/IOErrorEvent";

import { MapRoom3 } from "../maproom3/MapRoom3";
import { MapRoom3Cell } from "../maproom3/MapRoom3Cell";
import { MapRoom3ConfirmMigrationPopup } from "../maproom3/popups/MapRoom3ConfirmMigrationPopup";
import { MapRoom } from "../maproom_advanced/MapRoom";
import { CModifiableProperty } from "../monsters/components/CModifiableProperty";
import { IMapRoom } from "./IMapRoom";
import { IMapRoomCell } from "./IMapRoomCell";
import { SingletonLock } from "../../../config/singletonlock/SingletonLock";
import { URLLoaderApi } from "../../../URLLoaderApi";

import { BASE } from "../../../BASE";
import { GLOBAL } from "../../../GLOBAL";
import { INFERNO_DESCENT_POPUPS } from "../../../INFERNO_DESCENT_POPUPS";
import { KEYS } from "../../../KEYS";
import { LOGGER } from "../../../LOGGER";
import { MONSTERBAITER } from "../../../MONSTERBAITER";
import { PLEASEWAIT } from "../../../PLEASEWAIT";
import { WMATTACK } from "../../../WMATTACK";

/**
 * MapRoomManager - singleton manager for map room functionality.
 */
export class MapRoomManager {
    private static s_Instance: MapRoomManager | null = null;

    public static readonly MAP_ROOM_VERSION_1: number = 1;
    public static readonly MAP_ROOM_VERSION_2: number = 2;
    public static readonly MAP_ROOM_VERSION_3: number = 3;

    private m_CurrentMapRoom: IMapRoom | null = null;
    private m_MapRoom3URL: string = "";
    private m_MapRoomVersion: number = 1;
    private m_AttackCostMultiplier: CModifiableProperty;

    constructor(lock: SingletonLock) {
        this.m_AttackCostMultiplier = new CModifiableProperty(Number.MAX_VALUE, Number.MIN_VALUE, 1);
    }

    public static get instance(): MapRoomManager {
        MapRoomManager.s_Instance = MapRoomManager.s_Instance || new MapRoomManager(new SingletonLock());
        return MapRoomManager.s_Instance;
    }

    public get currentMapRoom(): IMapRoom | null {
        return this.m_CurrentMapRoom;
    }

    public get mapRoom3URL(): string {
        return this.m_MapRoom3URL;
    }

    public set mapRoom3URL(value: string) {
        this.m_MapRoom3URL = value;
    }

    public get attackCostMultiplier(): CModifiableProperty {
        return this.m_AttackCostMultiplier;
    }

    public get isInMapRoom2(): boolean {
        return this.m_MapRoomVersion === MapRoomManager.MAP_ROOM_VERSION_2;
    }

    public get isInMapRoom3(): boolean {
        return this.m_MapRoomVersion === MapRoomManager.MAP_ROOM_VERSION_3;
    }

    public get isInMapRoom2or3(): boolean {
        return this.isInMapRoom2 || this.isInMapRoom3;
    }

    public set bookmarkData(value: Record<string, any>) {
        this.m_CurrentMapRoom!.bookmarkData = value;
    }

    public set mapWidth(value: number) {
        this.m_CurrentMapRoom!.mapWidth = value;
    }

    public set mapHeight(value: number) {
        this.m_CurrentMapRoom!.mapHeight = value;
    }

    public get worldID(): number {
        return this.m_CurrentMapRoom!.worldID;
    }

    public set worldID(value: number) {
        this.m_CurrentMapRoom!.worldID = value;
    }

    public get isOpen(): boolean {
        return this.m_CurrentMapRoom!.isOpen;
    }

    public get flingerInRange(): boolean {
        return this.m_CurrentMapRoom!.flingerInRange;
    }

    public get viewOnly(): boolean {
        return this.m_CurrentMapRoom!.viewOnly;
    }

    public get playerOwnedCells(): Array<IMapRoomCell> | null {
        return this.m_CurrentMapRoom!.playerOwnedCells;
    }

    public get allianceDataById(): Map<number, any> | null {
        return this.m_CurrentMapRoom!.allianceDataById;
    }

    public init(onMapRoom3: boolean, mapRoom3HeaderURL: string): void {
        this.m_CurrentMapRoom = onMapRoom3 ? new MapRoom3(mapRoom3HeaderURL) : new MapRoom();
        if (onMapRoom3) {
            this.mapRoomVersion = MapRoomManager.MAP_ROOM_VERSION_3;
        }
    }

    public OnMapRoom3RelocationSuccessful(headerURL: string): void {
        this.BookmarksClear();
        GLOBAL._currentCell = null;
        this.m_CurrentMapRoom = new MapRoom3(headerURL);
    }

    public set mapRoomVersion(value: number) {
        if (value !== MapRoomManager.MAP_ROOM_VERSION_1 && value !== MapRoomManager.MAP_ROOM_VERSION_2 && value !== MapRoomManager.MAP_ROOM_VERSION_3) {
            return;
        }
        if (value === MapRoomManager.MAP_ROOM_VERSION_1 && this.m_CurrentMapRoom instanceof MapRoom3) {
            value = MapRoomManager.MAP_ROOM_VERSION_3;
        }
        this.m_MapRoomVersion = value;
    }

    public get mapRoomVersion(): number {
        return this.m_MapRoomVersion;
    }

    public SetupAndShow(): void {
        this.m_CurrentMapRoom!.Setup();
        this.Show();
    }

    public Show(): void {
        if (GLOBAL.mode === "build") {
            GLOBAL.m_mapRoomFunctional = true;
        }
        if (WMATTACK._inProgress || Boolean(MONSTERBAITER._attacking)) {
            return;
        }
        if (!GLOBAL._flags.discordOldEnough) {
            GLOBAL.Message(KEYS.Get("newmap_discord_age"));
            return;
        }
        if (GLOBAL._flags.maproom2 !== 1) {
            GLOBAL.Message(KEYS.Get("map_msg_disabled"));
            return;
        }
        if ((!BASE.isMainYard || GLOBAL._bMap && GLOBAL._bMap._canFunction || GLOBAL.mode !== GLOBAL.e_BASE_MODE.BUILD) && (GLOBAL.mode === "help" || !this.isOpen)) {
            PLEASEWAIT.Show(KEYS.Get("newmap_opening"));
            if (this.isOpen) {
                this.Hide();
            }
            GLOBAL._showMapWaiting = 1;
            return;
        }
        if (!GLOBAL._bMap) {
            GLOBAL.Message(KEYS.Get("map_msg_notbuilt"));
            return;
        }
        if (!GLOBAL._bMap._canFunction) {
            GLOBAL.Message(KEYS.Get("map_msg_damaged"));
            return;
        }
    }

    public ReadyToShow(): boolean {
        return this.m_CurrentMapRoom!.ReadyToShow();
    }

    public ShowDelayed(scrollToHome: boolean = false): void {
        this.m_CurrentMapRoom!.ShowDelayed(scrollToHome);
    }

    public Hide(): void {
        this.m_CurrentMapRoom!.Hide();
    }

    public Tick(): void {
        this.m_CurrentMapRoom!.Tick();
    }

    public TickFast(): void {
        if (this.m_CurrentMapRoom !== null) {
            this.m_CurrentMapRoom.TickFast();
        }
    }

    public BookmarksClear(): void {
        this.m_CurrentMapRoom!.BookmarksClear();
    }

    public ResizeHandler(): void {
        this.m_CurrentMapRoom!.ResizeHandler();
    }

    public FindCell(cellX: number, cellY: number): IMapRoomCell | null {
        return this.m_CurrentMapRoom!.FindCell(cellX, cellY);
    }

    public LoadCell(cellX: number, cellY: number, force: boolean = false): void {
        this.m_CurrentMapRoom!.LoadCell(cellX, cellY, force);
    }

    public CalculateCellId(cellX: number, cellY: number): number {
        return this.m_CurrentMapRoom!.CalculateCellId(cellX, cellY);
    }

    public GetHexCellsInRange(cellX: number, cellY: number, range: number): Array<MapRoom3Cell> {
        const mapRoom3 = this.m_CurrentMapRoom as MapRoom3;
        return mapRoom3 ? mapRoom3.GetHexCellsInRange(cellX, cellY, range) : [];
    }

    public GetClosestCell(cellX: number, cellY: number, range: number): MapRoom3Cell | null {
        const mapRoom3 = this.m_CurrentMapRoom as MapRoom3;
        return mapRoom3 ? mapRoom3.GetClosestCell(cellX, cellY, range) : null;
    }

    public UpgradeToMapRoom3(): void {
        GLOBAL._save = false;
        PLEASEWAIT.Show(KEYS.Get("upgrading_to_map_room3"));
        new URLLoaderApi().load(this.m_MapRoom3URL + "setmapversion", [["version", 3]], this.MapRoom3UpgradeSuccess.bind(this), this.MapRoom3UpgradeFail.bind(this));
    }

    private MapRoom3UpgradeSuccess(result: Record<string, any>): void {
        if (result.error === 0) {
            PLEASEWAIT.Hide();
            PLEASEWAIT.Show(KEYS.Get("upgraded_to_map_room3_refresh"));
            GLOBAL.CallJS("cc.reloadParent");
        } else {
            PLEASEWAIT.Hide();
            LOGGER.Log("err", result.error);
            GLOBAL.ErrorMessage("Error upgrading to Map Room 3");
        }
    }

    private MapRoom3UpgradeFail(event: IOErrorEvent): void {
        PLEASEWAIT.Hide();
        LOGGER.Log("err", "HTTP error upgrading to Map Room 3");
        GLOBAL.ErrorMessage("HTTP error upgrading to Map Room 3");
    }

    public DowngradeFromMapRoom3(): void {
    }

    public CheckForAndForceUpgradeFromMapRoom1(): void {
        if (this.isInMapRoom3 === true) {
            return;
        }
        if (this.currentMapRoom instanceof MapRoom3) {
            return;
        }
        if (BASE.isInfernoMainYardOrOutpost === true) {
            return;
        }
        if (INFERNO_DESCENT_POPUPS.isInDescent() === true) {
            return;
        }
        if (PLEASEWAIT._mc !== null) {
            return;
        }
        if (MapRoomManager.instance.isInMapRoom2 === false) {
            // Map Room 3 popup disabled
            // MapRoom3ConfirmMigrationPopup.instance.Show(true);
        }
    }
}
