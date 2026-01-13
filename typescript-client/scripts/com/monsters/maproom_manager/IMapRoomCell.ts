/**
 * Interface for map room cells.
 */
export interface IMapRoomCell {
    readonly baseID: number;
    readonly baseType: number;
    readonly cellX: number;
    readonly cellY: number;
    readonly cellHeight: number;
    readonly isDestroyed: boolean;
    readonly isLocked: boolean;
}
