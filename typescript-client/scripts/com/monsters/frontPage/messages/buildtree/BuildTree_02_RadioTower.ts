import { BuildTreeMessage } from "../BuildTreeMessage";

// Lazy imports to break circular dependency chains
function getBuildingEvent(): any { return require("../../../events/BuildingEvent").BuildingEvent; }
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getBASE(): any { return require("../../../../../BASE").BASE; }



/**
 * Build tree 02 - Radio Tower suggestion message.
 */
export class BuildTree_02_RadioTower extends BuildTreeMessage {
    constructor() {
        super("radiotower", 113, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        const townHallLevel: number = getGLOBAL().townHall._lvl.Get();
        return getBASE().hasNumBuildings(this._buildingType) <= 0 && townHallLevel >= 1 && townHallLevel <= 3 && Boolean(getGLOBAL()._flags.radio);
    }

    protected override onButtonClick(): void {
        this.buyBuilding(this._buildingType);
        getGLOBAL().eventDispatcher.addEventListener(
            getBuildingEvent().PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
