import { BuildTreeMessage } from "../BuildTreeMessage";

// Lazy imports to break circular dependency chains
function getBuildingEvent(): any { return require("../../../events/BuildingEvent").BuildingEvent; }
function getBUILDING23(): any { return require("../../../../../BUILDING23").BUILDING23; }
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getBASE(): any { return require("../../../../../BASE").BASE; }



/**
 * Build tree 15 - Laser Tower suggestion message.
 */
export class BuildTree_15_LaserTower extends BuildTreeMessage {
    constructor() {
        super("laser", getBUILDING23().TYPE, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        return getGLOBAL().townHall._lvl.Get() >= 4 && getBASE().hasNumBuildings(getBUILDING23().TYPE) <= 0;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(getBUILDING23().TYPE);
        getGLOBAL().eventDispatcher.addEventListener(
            getBuildingEvent().PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
