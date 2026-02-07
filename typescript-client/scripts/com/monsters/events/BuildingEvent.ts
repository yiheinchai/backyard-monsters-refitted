import Event from "openfl/events/Event";

// Lazy imports to break circular dependency chains
function getBFOUNDATION(): any { return require("../../../BFOUNDATION").BFOUNDATION; }



/**
 * Event dispatched for building state changes.
 */
export class BuildingEvent extends Event {
    public static readonly UPGRADED: string = "buildingUpgraded";
    public static readonly PLACED_FOR_CONSTRUCTION: string = "buildingPlacedForConstruction";
    public static ATTEMPT_RECYCLE: string = "attemptedToRecycleBuilding";
    public static ENTER_MR2: string = "enterMaproom2";
    public static DESTROY_MAPROOM: string = "destroyMaproom";

    private _building: BFOUNDATION;

    constructor(type: string, building: BFOUNDATION) {
        super(type);
        this._building = building;
    }

    public get building(): BFOUNDATION {
        return this._building;
    }
}
