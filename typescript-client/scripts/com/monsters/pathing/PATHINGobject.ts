

// Lazy imports to break circular dependency chains
function getBFOUNDATION(): any { return require("../../../BFOUNDATION").BFOUNDATION; }

/**
 * Pathfinding node object - represents a point in the pathfinding grid.
 */
export class PATHINGobject {
    public pointX: number = 0;
    public pointY: number = 0;
    public depth: number = 0;
    public cost: number = 0;
    public building: BFOUNDATION | null = null;

    constructor() {}

    public Init(): void {
        this.pointX = 0;
        this.pointY = 0;
        this.depth = 0;
        this.cost = 0;
        this.building = null;
    }

    public get pointID(): number {
        return this.pointX * 1000 + this.pointY;
    }
}
