import { IMapRoomCell } from "./IMapRoomCell";

/**
 * Interface for map room implementations.
 */
export interface IMapRoom {
    bookmarkData: any;
    mapWidth: number;
    mapHeight: number;
    worldID: number;
    readonly isOpen: boolean;
    readonly flingerInRange: boolean;
    readonly viewOnly: boolean;
    readonly playerOwnedCells: Array<IMapRoomCell>;
    readonly allianceDataById: Map<string, any>;

    Setup(): void;
    ReadyToShow(): boolean;
    ShowDelayed(showImmediate?: boolean): void;
    Hide(): void;
    Tick(): void;
    TickFast(): void;
    BookmarksClear(): void;
    ResizeHandler(): void;
    FindCell(x: number, y: number): IMapRoomCell | null;
    LoadCell(x: number, y: number, forceReload?: boolean): void;
    CalculateCellId(x: number, y: number): number;
}
