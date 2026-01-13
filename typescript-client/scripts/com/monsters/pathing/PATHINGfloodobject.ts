import Point from "openfl/geom/Point";

/**
 * Pathfinding flood fill object - used for flood-based pathfinding.
 */
export class PATHINGfloodobject {
    public pending: number = 0;
    public flood: { [key: string]: any } = {};
    public start: { [key: string]: any } = {};
    public edge: { [key: string]: any } = {};
    public minDepth: number = 9999999;
    public startpoints: { [key: string]: any } = {};
    public edgeLength: number = 0;
    public endPoint: Point | null = null;
    public ignoreWalls: boolean = false;

    constructor() {
        this.startpoints = {};
    }
}
