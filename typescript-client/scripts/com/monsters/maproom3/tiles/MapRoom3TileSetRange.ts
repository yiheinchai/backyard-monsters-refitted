/**
 * Map room 3 tile set range - defines a range of tiles for map room 3.
 */
export class MapRoom3TileSetRange {
    public start: number;
    public end: number;
    public options: Array<any>;

    constructor(start: number, end: number) {
        this.start = start;
        this.end = end;
        this.options = [];
    }
}
