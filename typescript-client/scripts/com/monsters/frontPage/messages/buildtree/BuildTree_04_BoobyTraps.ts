import { BuildTreeMessage } from "../BuildTreeMessage";

// Lazy imports to break circular dependency chains
function getBuildingEvent(): any { return require("../../../events/BuildingEvent").BuildingEvent; }
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getBASE(): any { return require("../../../../../BASE").BASE; }



/**
 * Build tree 04 - Booby Traps suggestion message.
 */
export class BuildTree_04_BoobyTraps extends BuildTreeMessage {
    constructor() {
        super("booby", 24, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        if (getBASE().hasNumBuildings(24) !== 0 || Boolean(getBASE().hasNumBuildings(117))) {
            return false;
        }
        return getGLOBAL().townHall._lvl.Get() >= 2;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(24);
        getGLOBAL().eventDispatcher.addEventListener(
            getBuildingEvent().PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
