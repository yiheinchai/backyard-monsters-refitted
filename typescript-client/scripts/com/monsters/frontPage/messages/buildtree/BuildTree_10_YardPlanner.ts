import { BuildTreeMessage } from "../BuildTreeMessage";

// Lazy imports to break circular dependency chains
function getBuildingEvent(): any { return require("../../../events/BuildingEvent").BuildingEvent; }
function getPLANNER(): any { return require("../../../../../PLANNER").PLANNER; }
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getBASE(): any { return require("../../../../../BASE").BASE; }



/**
 * Build tree 10 - Yard Planner suggestion message.
 */
export class BuildTree_10_YardPlanner extends BuildTreeMessage {
    constructor() {
        super("planner", getPLANNER().TYPE, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        if (getGLOBAL()._flags.yp_version === 2) {
            return false;
        }
        return getGLOBAL().townHall._lvl.Get() >= 3 && getBASE().hasNumBuildings(getPLANNER().TYPE) <= 0;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(getPLANNER().TYPE);
        getGLOBAL().eventDispatcher.addEventListener(
            getBuildingEvent().PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
