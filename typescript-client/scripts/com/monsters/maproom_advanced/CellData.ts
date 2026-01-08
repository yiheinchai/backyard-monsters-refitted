import { MapRoomCell } from "./MapRoomCell";

/**
 * Cell data wrapper - holds a MapRoomCell and its associated range value.
 */
export class CellData {
    public cell: MapRoomCell;
    public range: number;

    constructor(cell: MapRoomCell, range: number) {
        this.cell = cell;
        this.range = range;
    }
}
